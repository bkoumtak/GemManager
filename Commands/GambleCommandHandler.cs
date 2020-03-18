using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using GemManager.Repositories;
using GemManager.Models;

namespace GemManager.Commands
{
    public class GambleCommandHandler : IRequestHandler<GambleCommand, bool>
    {
        private ICardRepository _cardRepository;
        private IRepository<User> _userRepository;
        private IGemRepository _gemRepository;

        public GambleCommandHandler(ICardRepository cardRepository, IRepository<User> userRepository, IGemRepository gemRepository)
        {
            _cardRepository = cardRepository;
            _userRepository = userRepository;
            _gemRepository = gemRepository;
        }

        public Task<bool> Handle(GambleCommand request, CancellationToken cancellationToken)
        {
            var targetUserGuid = request.Target;
            var targetUser = _userRepository.GetById(targetUserGuid);

            var gemsList = _gemRepository.GetAll().ToList();

            if (gemsList.Count() < 4) {
                return Task.FromResult(false); 
            }

            var card = new Card
            {
                CardType = request.Card,
                Id = Guid.NewGuid(),
                Owner = targetUser,
                Week = request.Week
            };

            _cardRepository.Save(card);

            var gemsLost = request.GemsLost;
  
            for (var i = 0; i < gemsLost; i++)
            {
                _gemRepository.Delete(gemsList[i].Id); 
            }
           
            return Task.FromResult(true); 
        }
        
    }
}
