using System;
using GemManager.Enumerations;
using LiteDB;

namespace GemManager.Models
{
    [CollectionName(DbCollectionName.Message)]
    public class Message : IDocument
    {
        [BsonId]
        public Guid Id { get; set; }
        public int Week { get; set; }
        public string Title { get; set; }
        public string Body { get; set; }
    }
}