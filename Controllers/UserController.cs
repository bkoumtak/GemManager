using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GemManager.Models;
using GemManager.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace GemManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly IRepository<User> _userRepository;

        public UserController(ILogger<UserController> logger, IRepository<User>  userRepository)
        {
            _logger = logger;
            _userRepository = userRepository;
        }

        [HttpGet]
        public ActionResult Get()
        {
            var users = _userRepository.GetAll();
            return Ok(users);
        }

        [HttpGet]
        [Route("{id:int}")]
        public ActionResult Get(int id)
        {
            var user = _userRepository.GetById(id);
            return Ok(user);
        }


        [HttpPost]
        public ActionResult Post(User users)
        {
            _userRepository.Save(users);
            return Ok();
        }

        [HttpDelete]
        [Route("{id:int}")]
        public ActionResult Delete(int id)
        {
            _userRepository.Delete(id);
            return NoContent();
        }

        [HttpPut]
        [Route("{id:int}")]
        public ActionResult Put(User user)
        {
            var userFromDb = _userRepository.GetById(user.Id);

            userFromDb.GemsToGive = user.GemsToGive;
            userFromDb.TotalGems = user.TotalGems;
            
            _userRepository.Save(userFromDb);
            return Ok(user);
        }
    }
}
