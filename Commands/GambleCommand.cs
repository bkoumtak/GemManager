using GemManager.Enumerations;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GemManager.Commands
{
    public class GambleCommand : IRequest<bool>
    {
        public HttpRequest Request { get; }
        public Guid Target { get; }
        public CardType Card { get; }
        public int Week { get;  }
        public int GemsLost { get;  }

        public GambleCommand(HttpRequest request, Guid target, CardType cardType, int week, int gemsLost)
        {
            Request = request;
            Target = target;
            Card = cardType;
            Week = week;
            GemsLost = gemsLost;
        }
    }
}
