﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using GemManager.Repositories;
using GemManager.Models;
using MediatR;
using GemManager.Enumerations;
using GemManager.Controllers;

namespace GemManager.Commands
{
    public class RobinHoodCommandHandler : IRequestHandler<RobinHoodCommand, bool>
    {
        public readonly IGemRepository _gemRepository;
        public readonly ICardRepository _cardRepository;

        public RobinHoodCommandHandler(IGemRepository gemRepository, ICardRepository cardRepository)
        {
            _gemRepository = gemRepository;
            _cardRepository = cardRepository; 
        }

        public Task<bool> Handle(RobinHoodCommand request, CancellationToken cancellationToken)
        {
            var sourceUserGems = _gemRepository.GetByUser(request.Source);
            var targetUserGems = _gemRepository.GetByUser(request.Target);

            ValidationHelper.ValidateUser(request.Request, out var userGuid, out var userRole); 

            if (!sourceUserGems.Any())
                return Task.FromResult(false);

            var cardsInHand = _cardRepository.GetByUserAndCardType(userGuid, CardType.ROBIN_HOOD);

            if (!cardsInHand.Any())
                return Task.FromResult(false); 

            var sourceUserGemsList = sourceUserGems.ToList();
            var targetUserGemsList = targetUserGems.ToList(); 

            if (sourceUserGemsList.Count > targetUserGemsList.Count)
            {
                var gem = sourceUserGemsList[0];
                gem.Message += "[Originally to " + gem.To.Name + "]";
                gem.To.Id = request.Target;
                _gemRepository.Save(gem);

                // Use card
                _cardRepository.Delete(cardsInHand.FirstOrDefault().Id); 

                return Task.FromResult(true); 
            }

            return Task.FromResult(false);
        }
    }
}
