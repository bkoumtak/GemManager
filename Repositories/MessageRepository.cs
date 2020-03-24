using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GemManager.Models;
using Microsoft.Extensions.Configuration;

namespace GemManager.Repositories
{
    public class MessageRepository : GenericRepository<Message>
    {
        public MessageRepository(IConfiguration config) : base(config)
        {
        }
    }
}
