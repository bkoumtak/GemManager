using Microsoft.AspNetCore.Mvc;
using MediatR;
using System.Threading.Tasks;
using System;
using System.Linq;
using GemManager.Commands;
using GemManager.Models;
using GemManager.Repositories;
using GemManager.Enumerations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Infrastructure;

namespace GemManager.Controllers
{
    [Authorize(Policy = "OnlyEmployees")]
    [Route("api/[controller]")]
    [ApiController]
    public class CardController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ICardRepository _cardRepository;

        public CardController(IMediator mediator, ICardRepository cardRepository)
        {
            _mediator = mediator;
            _cardRepository = cardRepository; 
        }

        [HttpGet]
        public ActionResult Get()
        {
            var cards = _cardRepository.GetAll();

            return Ok(cards);
        }

        [Route("get_all/{week}")]
        public ActionResult GetAllCardsAndValidateMaledictionCard(int week)
        {
            var ActiveMaledictionCards = _cardRepository.GetAll().Where(x => x.IsActive && x.CardType == CardType.MALEDICTION);

            if (ActiveMaledictionCards.Any())
            {
                foreach (var activeMaledictionCard in ActiveMaledictionCards)
                {
                    if (week > activeMaledictionCard.Week)
                    {
                        _cardRepository.Delete(activeMaledictionCard.Id);
                    }
                }
            }
            
            var cards = _cardRepository.GetAll();
            
            return Ok(cards);
        }

        [HttpPost]
        public ActionResult Post(Card card)
        {
            ValidationHelper.ValidateUser(Request, out var userGuid, out var userRole);
            if (userRole == "Admin")
            {
                _cardRepository.Save(card);
                return Ok();
            }

            return Unauthorized();
        }

        [Route("robin_hood/{source}/{target}")]
        public async Task<IStatusCodeActionResult> RobinHood(string source, string target)
        {
            try
            {
                var sourceGuid = Guid.Parse(source);
                var targetGuid = Guid.Parse(target);

                var isOperationSuccessful = await _mediator.Send(new RobinHoodCommand(Request, sourceGuid, targetGuid));

                if (isOperationSuccessful) return Ok(new { message = "You have successfully stolen the gem from the rich and gave to the poor" });

                return Conflict(new { message = "The card has not been played!" });
            }
            catch (InvalidOperationException e)
            {
                return BadRequest(new { message = e.Message });
            }
        }

        [Route("self_hug/{gems}")]
        public async Task<IStatusCodeActionResult> SelfHug(string gems)
        {
            var gemsToGive = Int32.Parse(gems);
            
            if (gemsToGive <= 0)
                return Conflict(new { message = "The negative numbers or 0 are not allowed!" });

            try
            {
                var isOperationSuccessful = await _mediator.Send(new SelfHugCommand(Request, gemsToGive));

                if (isOperationSuccessful) return Ok(new { message = "You have successfully given a gem to yourself" });

                return Conflict(new { message = "You don't have enough gems to give any yourself!" });
            }
            catch (InvalidOperationException e)
            {
                return BadRequest(new { message = e.Message });
            }
        }

        [Route("steal_gem/{target}")]
        public async Task<IStatusCodeActionResult> StealGem(string target)
        {
            try
            {
                var targetGuid = Guid.Parse(target);

                var isOperationSuccessful = await _mediator.Send(new StealGemCommand(Request, targetGuid));

                if (isOperationSuccessful) return Ok(new { message = "You have successfully stolen a gem from the team member" });

                return Conflict(new { message = "The selected user doesn't have enoguh gems available" });
            }
            catch (InvalidOperationException e)
            {
                return BadRequest(new { message = e.Message });
            }
        }

        [Route("steal_card/{target}/{card}")]
        public async Task<IStatusCodeActionResult> StealCard(string target, string card)
        {
            try
            {
                var targetGuid = Guid.Parse(target);
                var cardType = (CardType)Int32.Parse(card);

                var isOperationSuccessful = await _mediator.Send(new StealCardCommand(Request, targetGuid, cardType));

                if (isOperationSuccessful) return Ok(new { message = "The card has been successfully stolen" });

                return Conflict(new { message = "Something went wrong!" });
            }
            catch (InvalidOperationException e)
            {
                return BadRequest(new { message = e.Message });
            }
        }
        
        [Route("double_receive/{target}/{week}")]
        public async Task<IStatusCodeActionResult> DoubleReceive(string target, int week)
        {
            try
            {
                var targetGuid = Guid.Parse(target);

                var isOperationSuccessful = await _mediator.Send(new DoubleReceiveCommand(Request, targetGuid, week));

                if (isOperationSuccessful) return Ok(new { message = "You've doubled the gems you have received this week from the targeted user!" });

                return Conflict(new { message = "You haven't received any gems from the targeted user. Please try again later!" });
            }
            catch (InvalidOperationException e)
            {
                return BadRequest(new { message = e.Message });
            }
        }

        [Route("double_send")]
        public async Task<IStatusCodeActionResult> DoubleSend()
        {
            try
            {
                var isOperationSuccessful = await _mediator.Send(new DoubleSendCommand(Request));

                if (isOperationSuccessful) return Ok(new { message = "You've doubled the gems you have to give this week!" });

                return Conflict(new { message = "You don't have enough gems to double" });
            }
            catch (InvalidOperationException e)
            {
                return BadRequest(new { message = e.Message });
            }
        }

        [Route("revive")]
        public async Task<IStatusCodeActionResult> Revive()
        {
            try
            {
                var isOperationSuccessful = await _mediator.Send(new ReviveCommand(Request));

                if (isOperationSuccessful) return Ok(new { message = "You've revived one gem from the graveyard!" });

                return Conflict(new { message = "There is no gems in the graveyard" });
            }
            catch (InvalidOperationException e)
            {
                return BadRequest(new { message = e.Message });
            }
        }

        [Route("malediction/{target}/{week}")]
        public async Task<IStatusCodeActionResult> Malediction(string target, int week)
        {
            try
            {
                var isOperationSuccessful = await _mediator.Send(new MaledictionCommand(Request, Guid.Parse(target), week));

                return Ok(new { message = "The malediction card has been successfully activated!" });
            }
            catch (InvalidOperationException e)
            {
                return BadRequest(new { message = e.Message });
            }
        }
    }
}