using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GemManager
{
    [AttributeUsage(AttributeTargets.Class)]
    public class CollectionNameAttribute : Attribute
    {
        public string Name { get; private set; }
        public CollectionNameAttribute(string name)
        {
            Name = name;
        }

    }
}
