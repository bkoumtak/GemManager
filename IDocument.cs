﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LiteDB;

namespace GemManager
{
    public interface IDocument
    {
        [BsonId]
        public Guid Id { get; set; }
    }
}

