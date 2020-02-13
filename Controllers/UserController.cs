using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GemManager.Models;
using GemManager.Repositories;
using GemManager.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace GemManager.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly IRepository<User> _userRepository;
        private readonly IUserService _userService;


        public UserController(ILogger<UserController> logger, IRepository<User>  userRepository, IUserService userService)
        {
            _logger = logger;
            _userRepository = userRepository;
            _userService = userService;
        }

        [AllowAnonymous]
        [HttpPost("auth")]
        public IActionResult Authenticate([FromBody]AuthenticateModel model)
        {
            var user = _userService.Authenticate(model.Username, model.Password);

            if (user == null)
                return BadRequest(new { message = "Username or password is incorrect" });

            return Ok(user);
        }

        [HttpGet]
        public ActionResult Get()
        {
            var users = _userRepository.GetAll();
            return Ok(users);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("{id:int}")]
        public ActionResult Get(int id)
        {
            var user = _userRepository.GetById(id);
            return Ok(user);
        }

        [AllowAnonymous]
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

        [AllowAnonymous]
        [HttpPut]
        [Route("{id:int}")]
        public ActionResult Put(User user)
        {
            var userFromDb = _userRepository.GetById(user.Id);

            userFromDb.GemsToGive = user.GemsToGive;
            userFromDb.TotalGems = user.TotalGems;
            
            _userRepository.Save(user);
            return Ok(user);
        }
    }
}
