using System;
using System.DirectoryServices.AccountManagement;
using System.Linq;
using System.Threading.Tasks;
using GemManager.Commands;
using GemManager.Enumerations;
using GemManager.Models;
using GemManager.Repositories;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace GemManager.Controllers
{
    [Authorize(Policy = "OnlyEmployees")]
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly IRepository<User> _userRepository;
        private readonly IMediator _mediator;

        public UserController(ILogger<UserController> logger, IRepository<User>  userRepository, IMediator mediator)
        {
            _logger = logger;
            _userRepository = userRepository;
            _mediator = mediator;
        }

        [HttpGet("auth")]
        public IActionResult Authenticate()
        {
            using (var adContext = new PrincipalContext(ContextType.Domain, "genetec.com"))
            {
                var usersFromDb = _userRepository.GetAll();
                UserPrincipal userFromAd = UserPrincipal.FindByIdentity(adContext, HttpContext.User.Identity.Name.Replace("GENETEC\\", String.Empty));
                User user = usersFromDb.SingleOrDefault(x => x.Id == userFromAd?.Guid);
                
                return Ok(user);
            }
        }
        
        [HttpGet]
        public ActionResult Get()
        {
            var users = _userRepository.GetAll();
            
            return Ok(users);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("{id:guid}")]
        public ActionResult Get(Guid id)
        {
            var user = _userRepository.GetById(id);
            return Ok(user);
        }
        
        [HttpPut]
        [Route("{id:guid}")]
        public ActionResult Put(User user)
        {
            ValidationHelper.ValidateUser(Request, out var userGuid, out var userRole);
            if (user.Id == userGuid || userRole == "Admin") { 
                var userFromDb = _userRepository.GetById(user.Id);

                userFromDb.GemsToGive = user.GemsToGive;
                userFromDb.TotalGems = user.TotalGems;
                
                _userRepository.Save(userFromDb);
                return Ok(userFromDb);
            }
            return BadRequest(new { message = "Username or password is incorrect" });
        }

        [HttpPut("add2gems")]
        public ActionResult Add2GemsToAllMembers()
        {
            var usersFromDb = _userRepository.GetAll();
            
            var usersFromDbWith2Gems = usersFromDb.Select(x =>
            {
                if (x.Name != "Graveyard")
                    x.GemsToGive += 2;
                
                return x;
            });
            
            _userRepository.Save(usersFromDbWith2Gems);

            return Ok();
        }

        [Route("gamble/{target}/{card}/{week}/{lost}")]
        public async Task<bool> Gamble(string target, string card, string week, string lost)
        {
            ValidationHelper.ValidateUser(Request, out var userGuid, out var userRole);
            if (userRole == "Admin")
            {
                var targetGuid = Guid.Parse(target);
                var cardType = (CardType)Int32.Parse(card);
                var currentWeek = Int32.Parse(week);
                var gemsLost = Int32.Parse(lost);

                return await _mediator.Send(new GambleCommand(Request, targetGuid, cardType, currentWeek, gemsLost));
            }

            return await Task.FromResult(false);
        }
    }
}
