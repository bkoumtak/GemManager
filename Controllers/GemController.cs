using Microsoft.AspNetCore.Mvc;
using GemManager.Models;
using GemManager.Repositories;
using Microsoft.AspNetCore.Authorization;

namespace GemManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class GemController : ControllerBase
    {
        private readonly IGemRepository _gemRepository;
        private readonly IRepository<User> _userRepository;

        public GemController(IGemRepository gemRepository, IRepository<User> userRepository)
        {
            _gemRepository = gemRepository;
            _userRepository = userRepository;
        }

        [HttpPost]
        public ActionResult Post(Gem gems)
        {
            ValidationHelper.ValidateUser(Request, out var userGuid, out var userRole);

            if (userGuid == gems.From.Id) { 
                var curUser = _userRepository.GetById(gems.From.Id);

                if (curUser.GemsToGive > 0)
                    _gemRepository.Save(gems);
                else
                    return BadRequest("You don't have enough gems to give");
            }
            else
            {
                return BadRequest("The operation is not allowed");
            }
            return Ok();
        }

        [HttpGet]
        public ActionResult GetStuff() 
        {
            var gems = _gemRepository.GetAll();
            return Ok(gems); 
        }

        [HttpGet]
        [Route("{week:int}")]
        public ActionResult Get(int week)
        {
            var gems = _gemRepository.GetByWeek(week);
            return Ok(gems);
        }

    }
}