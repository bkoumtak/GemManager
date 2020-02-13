using System;
using LiteDB;

namespace GemManager.Models
{
    [CollectionName(DbCollectionName.Gem)]
    public class Gem : IDocument
    { 
        [BsonId]
        public Guid Id { get; set; }
        [BsonRef(DbCollectionName.User)]
        public User From { get; set; }
        [BsonRef(DbCollectionName.User)]
        public User To { get; set; }
        public string Message { get; set; }
    }
}
