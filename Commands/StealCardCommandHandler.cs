using GemManager.Models;
using GemManager.Repositories;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using GemManager.Enumerations;
using GemManager.Controllers;

namespace GemManager.Commands
{
    public class StealCardCommandHandler : IRequestHandler<StealCardCommand, bool>
    {
        private readonly ICardRepository _cardRepository;
        private readonly IRepository<User> _userRepository;

        public StealCardCommandHandler(ICardRepository cardRepository, IRepository<User> userRepository)
        {
            _cardRepository = cardRepository;
            _userRepository = userRepository;
        }

        public Task<bool> Handle(StealCardCommand request, CancellationToken cancellationToken)
        {
            var targetCards = _cardRepository.GetByUserAndCardType(request.Target, request.Card);

            if(!targetCards.Any())
            {
                return Task.FromResult(false); 
            }
            else
            {
                // ValidationHelper.ValidateUser(request.Request, out var userGuid, out var userRole);
                var userGuid = Guid.Parse("31c2d99f-567f-4024-a997-b5b9ab8ecd54");

                var user = _userRepository.GetById(userGuid);

                var userCards = _cardRepository.GetByUserAndCardType(userGuid, CardType.STEAL_CARD);
                if (userCards.Any())
                { 
                    var card = targetCards.FirstOrDefault();
                    card.Owner = user;

                    _cardRepository.Save(card);

                    // Use up card
                    _cardRepository.Delete(userCards.FirstOrDefault().Id); 

                    return Task.FromResult(true);
                }

                return Task.FromResult(false); 
            }
        }
    }
}
