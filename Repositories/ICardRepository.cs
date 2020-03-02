using System;
using System.Collections.Generic;
using GemManager.Enumerations;
using GemManager.Models;

namespace GemManager.Repositories
{
    public interface ICardRepository
    {
        public IEnumerable<Card> GetByUserAndCardType(Guid id, CardType cardType);

        void Delete(Guid id);

        void Save(Card document);

        void Save(IEnumerable<Card> document);
    }
}
