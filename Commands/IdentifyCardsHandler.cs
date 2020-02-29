using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;

namespace GemManager.Commands
{
    public class IdentifyCardsHandler : IRequestHandler<IdentifyCards, bool>
    {
        public Task<bool> Handle(IdentifyCards request, CancellationToken cancellationToken)
        {
            throw new System.NotImplementedException();
        }
    }
}