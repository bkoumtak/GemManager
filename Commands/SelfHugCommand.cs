using System;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace GemManager.Commands
{
    public class SelfHugCommand : IRequest<bool>
    {
        public HttpRequest Request { get; }
        public int GemsToGive { get; }

        public SelfHugCommand(HttpRequest request, int gemsToGive)
        {
            Request = request;
            GemsToGive = gemsToGive;
        }
    }
}
