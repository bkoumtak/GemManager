using System;
using System.DirectoryServices.AccountManagement;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using GemManager.Commands;
using GemManager.Enumerations;
using GemManager.Helpers;
using GemManager.Models;
using GemManager.Repositories;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Tokens;

namespace GemManager.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly IRepository<User> _userRepository;
        private readonly AppSettings _appSettings;
        private readonly IMediator _mediator;

        public UserController(ILogger<UserController> logger, IRepository<User>  userRepository, IOptions<AppSettings> appSettings, IMediator mediator)
        {
            _logger = logger;
            _userRepository = userRepository;
            _appSettings = appSettings.Value;
            _mediator = mediator;
        }

        [AllowAnonymous]
        [HttpPost("auth")]
        public IActionResult Authenticate([FromBody]AuthenticateModel model)
        {
            using (var adContext = new PrincipalContext(ContextType.Domain, "genetec.com"))
            {
                var result = adContext.ValidateCredentials(model.Username, model.Password, ContextOptions.Signing);
                User user;

                if (result)
                {
                    var usersFromDb = _userRepository.GetAll();
                    UserPrincipal userFromAd = UserPrincipal.FindByIdentity(adContext, model.Username);
                    user = usersFromDb.SingleOrDefault(x => x.Id == userFromAd?.Guid);

                    if (user == null)
                    {
                        user = new User()
                        {
                            Id = userFromAd.Guid.GetValueOrDefault(),
                            FirstName = userFromAd.GivenName,
                            LastName = userFromAd.Surname,
                            Name = userFromAd.Name,
                            Username = userFromAd.SamAccountName,
                            Role = "User"
                        };

                        _userRepository.Save(user);
                    }

                    IdentityModelEventSource.ShowPII = true;

                    // authentication successful so generate jwt token
                    var tokenHandler = new JwtSecurityTokenHandler();
                    var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
                    var tokenDescriptor = new SecurityTokenDescriptor
                    {
                        Subject = new ClaimsIdentity(new Claim[]
                        {
                            new Claim(ClaimTypes.Name, model.Username),
                            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                            new Claim(ClaimTypes.Role, user.Role)
                        }),
                        Expires = DateTime.UtcNow.AddDays(7),
                        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),
                            SecurityAlgorithms.HmacSha256Signature),
                        Issuer = "genetec.com",
                        Audience = "genetec.com"
                    };
                    var token = tokenHandler.CreateToken(tokenDescriptor);

                    user.Token = tokenHandler.WriteToken(token);
                    
                    return Ok(user);
                }
            }
            return BadRequest(new { message = "Username or password is incorrect" });
        }
        [AllowAnonymous]
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

            return false;
        }
    }
}
