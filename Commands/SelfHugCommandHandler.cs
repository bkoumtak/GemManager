using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using GemManager.Repositories;
using GemManager.Models;
using GemManager.Enumerations;
using GemManager.Controllers;
using MediatR;

namespace GemManager.Commands
{
    public class SelfHugCommandHandler : IRequestHandler<SelfHugCommand, bool>
    {
        public readonly IGemRepository _gemRepository;
        public readonly IRepository<User> _userRepository;
        public readonly ICardRepository _cardRepository; 

        public SelfHugCommandHandler(IGemRepository gemRepository, IRepository<User> userRepository, ICardRepository cardRepository)
        {
            _gemRepository = gemRepository;
            _userRepository = userRepository;
            _cardRepository = cardRepository;
        }

        public Task<bool> Handle(SelfHugCommand request, CancellationToken cancellationToken)
        {
            var gemsList = new List<Gem>();

            // ValidationHelper.ValidateUser(request.Request, out var userGuid, out var userRole); 
            var userGuid = Guid.Parse("31c2d99f-567f-4024-a997-b5b9ab8ecd54");

            var user = _userRepository.GetById(userGuid);

            var cardsOfUser = _cardRepository.GetByUserAndCardType(userGuid, CardType.SELF_HUG); 

            if (!cardsOfUser.Any())
            {
                return Task.FromResult(false);
            }

            if (user.GemsToGive >= request.GemsToGive)
            {
                for (int i = 0; i < request.GemsToGive; i++)
                {
                    var newGuid = Guid.NewGuid();
                    var gem = new Gem()
                    {
                        Id = newGuid,
                        From = user,
                        To = user,
                        Message = user.FirstName + " gave a gem to themselves"
                    };

                    gemsList.Add(gem);

                    user.GemsToGive = user.GemsToGive - 1;
                }

                _gemRepository.Save(gemsList);
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
