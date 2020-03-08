using System;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace GemManager.Commands
{
    public class ReviveCommand : IRequest<bool>
    {
        public HttpRequest Request { get; }

        public ReviveCommand(HttpRequest request)
        {
            Request = request;
        }
    }
}
