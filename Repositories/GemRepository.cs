using GemManager.Models;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;

namespace GemManager.Repositories
{

    public class GemRepository : GenericRepository<Gem>, IGemRepository
    {
        public GemRepository(IConfiguration config):base(config)
        {

        }

        public override IEnumerable<Gem> GetAll()
        {
            return GetLiteCollection()
                .Include(gems => gems.From)
                .Include(gems => gems.To)
                .FindAll();
        }

        public override Gem GetById(Guid id)
        {
            return GetLiteCollection()
                .Include(gems => gems.From)
                .Include(gems => gems.To)
                .FindOne(d => d.Id == id);
        }
    }
}
