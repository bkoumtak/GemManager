using GemManager.Models;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using GemManager.Enumerations;

namespace GemManager.Repositories
{

    public class CardRepository : GenericRepository<Card>, ICardRepository
    {
        public CardRepository(IConfiguration config):base(config)
        {

        }

        public IEnumerable<Card> GetByUserAndCardType(Guid id, CardType cardType)
        {
            return GetLiteCollection()
                .Include(card => card.Owner)
                .Find(card => card.Owner.Id == id && card.CardType == cardType);
        }
    }
}
