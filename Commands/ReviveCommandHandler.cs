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
    public class ReviveCommandHandler : IRequestHandler<ReviveCommand, bool>
    {
        public readonly IGemRepository _gemRepository;
        public readonly IRepository<User> _userRepository;
        public readonly ICardRepository _cardRepository; 

        public ReviveCommandHandler(IGemRepository gemRepository, IRepository<User> userRepository, ICardRepository cardRepository)
        {
            _gemRepository = gemRepository;
            _userRepository = userRepository;
            _cardRepository = cardRepository;
        }

        public Task<bool> Handle(ReviveCommand request, CancellationToken cancellationToken)
        {
            var gemsList = new List<Gem>();
            ValidationHelper.ValidateUser(request.Request, out var userGuid, out var userRole);
            var user = _userRepository.GetById(userGuid);

            var cardsOfUser = _cardRepository.GetByUserAndCardType(userGuid, CardType.REVIVE); 

            if (!cardsOfUser.Any())
            {
                return Task.FromResult(false);
            }

            var graveyardGems = _gemRepository.GetByUser(Guid.Parse("0a9c40cd-34f5-439c-ad3c-0946aea1e5ea"));

            if (graveyardGems.Count() > 0)
            {
                var firstGemFromGraveyard = graveyardGems.FirstOrDefault();

                firstGemFromGraveyard.To.Id = user.Id;

                _gemRepository.Save(firstGemFromGraveyard);
                
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
