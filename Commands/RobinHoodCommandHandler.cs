using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using GemManager.Repositories;
using GemManager.Models;
using MediatR;

namespace GemManager.Commands
{
    public class RobinHoodCommandHandler : IRequestHandler<RobinHoodCommand, bool>
    {
        public readonly IGemRepository _gemRepository;

        public RobinHoodCommandHandler(IGemRepository gemRepository)
        {
            _gemRepository = gemRepository;
        }

        public Task<bool> Handle(RobinHoodCommand request, CancellationToken cancellationToken)
        {
            var sourceUserGems = _gemRepository.GetByUser(request.Source);
            var targetUserGems = _gemRepository.GetByUser(request.Target);

            var sourceUserGemsList = sourceUserGems.ToList();
            var targetUserGemsList = targetUserGems.ToList(); 

            if (sourceUserGemsList.Count > targetUserGemsList.Count)
            {
                var gem = sourceUserGemsList[0];
                gem.Message += "[Originally to " + gem.To.Name + "]";
                gem.To.Id = request.Target;
                _gemRepository.Save(gem);

                return Task.FromResult(true); 
            }

            return Task.FromResult(false);
        }
    }
}
