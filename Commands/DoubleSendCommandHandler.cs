using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using GemManager.Controllers;
using GemManager.Repositories;
using GemManager.Models;
using GemManager.Enumerations;
using MediatR;

namespace GemManager.Commands
{
    public class DoubleSendCommandHandler : IRequestHandler<DoubleSendCommand, bool>
    {
        public readonly IGemRepository _gemRepository;
        public readonly IRepository<User> _userRepository;
        public readonly ICardRepository _cardRepository; 

        public DoubleSendCommandHandler(IGemRepository gemRepository, IRepository<User> userRepository, ICardRepository cardRepository)
        {
            _gemRepository = gemRepository;
            _userRepository = userRepository;
            _cardRepository = cardRepository;
        }

        public Task<bool> Handle(DoubleSendCommand request, CancellationToken cancellationToken)
        {
            ValidationHelper.ValidateUser(request.Request, out var userGuid, out var userRole);
            var user = _userRepository.GetById(userGuid);

            var cardsOfUser = _cardRepository.GetByUserAndCardType(userGuid, CardType.DOUBLE_SEND); 

            if (!cardsOfUser.Any())
            {
                return Task.FromResult(false);
            }
            
            if (user.GemsToGive >= 0)
            {
                user.GemsToGive = user.GemsToGive > 0 ? user.GemsToGive : 1;
                user.GemsToGive *= 2;
                _userRepository.Save(user);

                var card = cardsOfUser.FirstOrDefault();
                _cardRepository.Delete(card.Id);
                
                return Task.FromResult(true); 
            }
            else
            {
                return Task.FromResult(false);
            }
        }
    }
}
