using System;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace GemManager.Commands
{
    public class DoubleSendCommand : IRequest<bool>
    {
        public HttpRequest Request { get; }

        public DoubleSendCommand(HttpRequest request)
        {
            Request = request;
        }
    }
}
