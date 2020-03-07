using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using GemManager.Repositories;
using GemManager.Models;
using GemManager.Enumerations;
using MediatR;
using GemManager.Controllers;

namespace GemManager.Commands
{
    public class StealGemCommandHandler : IRequestHandler<StealGemCommand, bool>
    {
        private readonly IGemRepository _gemRepository;
        private readonly IRepository<User> _userRepository;
        private readonly ICardRepository _cardRepository;

        public StealGemCommandHandler(IGemRepository gemRepository, IRepository<User> userRepository, ICardRepository cardRepository)
        {
            _gemRepository = gemRepository;
            _userRepository = userRepository;
            _cardRepository = cardRepository; 
        }

        public Task<bool> Handle(StealGemCommand request, CancellationToken cancellationToken)
        {
            var gems = _gemRepository.GetByUser(request.Target);
          
            var gem = gems.FirstOrDefault();
            
            if (gem != null)
            {
                ValidationHelper.ValidateUser(request.Request, out var userGuid, out var userRole);

                var user = _userRepository.GetById(userGuid);

                var cardsInPossession = _cardRepository.GetByUserAndCardType(userGuid, CardType.STEAL_GEM);
                if (!cardsInPossession.Any())
                    return Task.FromResult(false); 

                gem.Message += "\n Stolen from: " + gem.To.FirstName;
                gem.To = user;

                _gemRepository.Save(gem);

                _cardRepository.Delete(cardsInPossession.FirstOrDefault().Id); 

                return Task.FromResult(true);
            }
            else
            {
                return Task.FromResult(false); 
            }
        }
    }
}
