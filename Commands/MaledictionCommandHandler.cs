using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using GemManager.Controllers;
using GemManager.Enumerations;
using GemManager.Repositories;
using GemManager.Models;
using MediatR;

namespace GemManager.Commands
{
    public class MaledictionCommandHandler : IRequestHandler<MaledictionCommand, bool>
    {
        public readonly IGemRepository _gemRepository;
        public readonly ICardRepository _cardRepository;

        public MaledictionCommandHandler(IGemRepository gemRepository, ICardRepository cardRepository)
        {
            _gemRepository = gemRepository;
            _cardRepository = cardRepository;
        }

        public Task<bool> Handle(MaledictionCommand request, CancellationToken cancellationToken)
        {
            ValidationHelper.ValidateUser(request.Request, out var userGuid, out var userRole);
            
            var cardsOfUser = _cardRepository.GetByUserAndCardType(userGuid, CardType.MALEDICTION);

            if (!cardsOfUser.Any())
            {
                return Task.FromResult(false);
            }

            var card = cardsOfUser.FirstOrDefault();

            var targetUserGemsFromCurrentWeek = _gemRepository.GetByUser(request.Target).Where(x => x.Week == request.Week).ToList();

            if (targetUserGemsFromCurrentWeek.Any())
            {
                foreach (var gem in targetUserGemsFromCurrentWeek)
                {
                    gem.Message += "[Malediction - Originally to " + gem.To.Name + "]";
                    gem.To.Id = Guid.Parse("0a9c40cd-34f5-439c-ad3c-0946aea1e5ea");
                    
                    _gemRepository.Save(gem);
                }
            }
            card.IsActive = true;
            _cardRepository.Save(card);
            return Task.FromResult(true);
        }
    }
}
