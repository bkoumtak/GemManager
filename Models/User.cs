﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LiteDB;

namespace GemManager.Models
{
    [CollectionName(DbCollectionName.User)]
    public class User : IDocument
    {
        [BsonId]
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int GemsToGive { get; set; }
        public int TotalGems { get; set; }
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Role { get; set; }  
    }
}
