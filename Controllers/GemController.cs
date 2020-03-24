using System;
using System.Linq;
using GemManager.Enumerations;
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
        private readonly IRepository<Message> _messageRepository;
        private readonly ICardRepository _cardRepository;

        public GemController(IGemRepository gemRepository, IRepository<User> userRepository, IRepository<Message> messageRepository, ICardRepository cardRepository)
        {
            _gemRepository = gemRepository;
            _userRepository = userRepository;
            _messageRepository = messageRepository;
            _cardRepository = cardRepository;
        }

        [HttpPost]
        public ActionResult Post(Gem gems)
        {
            ValidationHelper.ValidateUser(Request, out var userGuid, out var userRole);
            string msg = "You have successfully sent the gem(s) to ";

            if (userGuid == gems.From.Id) { 
                var curUser = _userRepository.GetById(gems.From.Id);
                var targetUser = _userRepository.GetById(gems.To.Id);
                var messageLog = new Message
                {
                    Id = Guid.NewGuid(),
                    Title = curUser.FirstName + " gave a gem to " + targetUser.FirstName,
                    Body = gems.Message,
                    Week = gems.Week
                };

                _messageRepository.Save(messageLog);
                msg = MaledictionCardGemsDivert(gems, msg);

                if (curUser.GemsToGive > 0)
                    _gemRepository.Save(gems);
                else
                    return BadRequest("You don't have enough gems to give");
            }
            else
            {
                return BadRequest("The operation is not allowed");
            }
            
            return Ok(new { message = msg});
        }

        private string MaledictionCardGemsDivert(Gem gems, string msg)
        {
            var ActiveMaledictionCards = _cardRepository.GetAll().Where(x => x.IsActive && x.CardType == CardType.MALEDICTION);

            if (ActiveMaledictionCards.Any())
            {
                foreach (var activeMaledictionCard in ActiveMaledictionCards)
                {
                    if (gems.Week > activeMaledictionCard.Week)
                    {
                        _cardRepository.Delete(activeMaledictionCard.Id);
                        continue;
                    }

                    if (gems.To.Id == activeMaledictionCard.TargetPlayerGuid)
                    {
                        gems.To = _userRepository.GetAll().SingleOrDefault(x => x.Name == "Graveyard");
                        msg = "The gem has been diverted to the graveyard since the user was spelled by the malediction card!";
                    }
                }
            }

            return msg;
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