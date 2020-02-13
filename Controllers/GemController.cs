using Microsoft.AspNetCore.Mvc;
using GemManager.Models;
using GemManager.Repositories;

namespace GemManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GemController : ControllerBase
    {
        private readonly IGemRepository _gemRepository;

        public GemController(IGemRepository gemRepository)
        {
            _gemRepository = gemRepository;
        }

        [HttpPost]
        public ActionResult Post(Gem gems)
        {
            _gemRepository.Save(gems);
            return Ok();
        }

        [HttpGet]
        public ActionResult GetStuff() 
        {
            var gems = _gemRepository.GetAll();
            return Ok(gems); 
        }
    }
}