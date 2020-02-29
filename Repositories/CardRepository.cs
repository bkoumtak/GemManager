using GemManager.Models;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;

namespace GemManager.Repositories
{

    public class CardRepository : GenericRepository<Card>, ICardRepository
    {
        public CardRepository(IConfiguration config):base(config)
        {

        }

        
    }
}
