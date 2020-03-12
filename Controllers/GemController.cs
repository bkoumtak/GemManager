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
        private readonly ICardRepository _cardRepository;

        public GemController(IGemRepository gemRepository, IRepository<User> userRepository, ICardRepository cardRepository)
        {
            _gemRepository = gemRepository;
            _userRepository = userRepository;
            _cardRepository = cardRepository;
        }

        [HttpPost]
        public ActionResult Post(Gem gems)
        {
            ValidationHelper.ValidateUser(Request, out var userGuid, out var userRole);

            if (userGuid == gems.From.Id) { 
                var curUser = _userRepository.GetById(gems.From.Id);

                MaledictionCardGemsDivert(gems);

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

        private void MaledictionCardGemsDivert(Gem gems)
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
                        gems.To = _userRepository.GetAll().SingleOrDefault(x => x.Name == "Graveyard");
                }
            }
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