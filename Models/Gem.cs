using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LiteDB;

namespace GemManager.Models
{
    [CollectionName(DbCollectionName.Gem)]
    public class Gem : IDocument
    {
        public int Id { get; set; }

        [BsonRef(DbCollectionName.User)]
        public User From { get; set; }

        [BsonRef(DbCollectionName.User)]
        public User To { get; set; }

        public string Message { get; set; }
    }
}
