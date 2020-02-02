using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LiteDB;

namespace GemManager.Models
{
    [CollectionName("user")]
    public class User : IDocument
    {
        [BsonId]
        public int Id { get; set; }
        public string Name { get; set; }
        public int GemsToGive { get; set; }
        public int TotalGems { get; set; }

    }
}
