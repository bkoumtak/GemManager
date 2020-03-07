using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;
using GemManager.Enumerations;

namespace GemManager.Commands
{
    public class StealCardCommand : IRequest<bool>
    {
        public HttpRequest Request { get; set; }

        public Guid Target { get; set; }

        public CardType Card { get; set; }

        public StealCardCommand(HttpRequest httpRequest, Guid target, CardType card)
        {
            Request = httpRequest;
            Target = target;
            Card = card; 
        }

    }
}
