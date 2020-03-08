﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using GemManager.Repositories;
using GemManager.Models;
using GemManager.Enumerations;
using MediatR;

namespace GemManager.Commands
{
    public class DoubleReceiveCommandHandler : IRequestHandler<DoubleReceiveCommand, bool>
    {
        public readonly IGemRepository _gemRepository;
        public readonly IRepository<User> _userRepository;
        public readonly ICardRepository _cardRepository; 

        public DoubleReceiveCommandHandler(IGemRepository gemRepository, IRepository<User> userRepository, ICardRepository cardRepository)
        {
            _gemRepository = gemRepository;
            _userRepository = userRepository;
            _cardRepository = cardRepository;
        }

        public Task<bool> Handle(DoubleReceiveCommand request, CancellationToken cancellationToken)
        {
            var gemsList = new List<Gem>();
            var userGuid = Guid.Parse("31c2d99f-567f-4024-a997-b5b9ab8ecd54");
            var user = _userRepository.GetById(userGuid);
            var userTarget = _userRepository.GetById(request.Target);
            
            var cardsOfUser = _cardRepository.GetByUserAndCardType(userGuid, CardType.DOUBLE_RECEIVE); 

            if (!cardsOfUser.Any())
            {
                return Task.FromResult(false);
            }

            var receivedGemsFromTargetThisWeek = _gemRepository.GetByWeek(cardsOfUser.SingleOrDefault().Week).Select(x => x.From.Id == userTarget.Id);

            if (receivedGemsFromTargetThisWeek.Any())
            {
                for (int i = 0; i < receivedGemsFromTargetThisWeek.Count(); i++)
                {
                    var newGuid = Guid.NewGuid();
                    var gem = new Gem()
                    {
                        Id = newGuid,
                        From = userTarget,
                        To = user,
                        Message = user.Name + " doubled the number of gems he/she was given from " + userTarget.Name
                    };

                    gemsList.Add(gem);
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
