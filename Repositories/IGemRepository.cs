using System;
using System.Collections.Generic;
using GemManager.Models;

namespace GemManager.Repositories
{
    public interface IGemRepository
    {
        IEnumerable<Gem> GetAll();

        Gem GetById(Guid id);

        void Save(Gem document);

        void Save(IEnumerable<Gem> document);

        void Delete(Guid id);
    }
}
