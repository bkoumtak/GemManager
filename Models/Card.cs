using System;
using GemManager.Enumerations;
using LiteDB;

namespace GemManager.Models
{
    [CollectionName(DbCollectionName.Card)]
    public class Card : IDocument
    { 
        [BsonId]
        public Guid Id { get; set; }
        public int Week { get; set; }
        [BsonRef(DbCollectionName.User)]
        public User Owner { get; set; }
        public bool IsActive { get; set; }
        public Guid TargetPlayerGuid { get; set; }
        public CardType CardType { get; set; }
    }
}
