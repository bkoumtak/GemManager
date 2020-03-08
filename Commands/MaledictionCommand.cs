using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace GemManager.Commands
{
    public class MaledictionCommand : IRequest<bool>
    {
        public Guid Source { get; }
        public Guid Target { get; }
        public HttpRequest Request { get; }

        public MaledictionCommand (HttpRequest request, Guid source, Guid target)
        {
            Request = request;
            Source = source;
            Target = target;
        }

    }
}
