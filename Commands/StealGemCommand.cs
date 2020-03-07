using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace GemManager.Commands
{
    public class StealGemCommand : IRequest<bool>
    {
        public HttpRequest Request { get; set; } 
        public Guid Target { get; set; }

        public StealGemCommand(HttpRequest httpRequest, Guid target)
        {
            Request = httpRequest;
            Target = target; 
        }
    }
}
