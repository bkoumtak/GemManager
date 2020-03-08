using System;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace GemManager.Commands
{
    public class DoubleReceiveCommand : IRequest<bool>
    {
        public Guid Target { get; }
        public HttpRequest Request { get; }

        public DoubleReceiveCommand(HttpRequest request, Guid target)
        {
            Request = request;
            Target = target;
        }
    }
}
