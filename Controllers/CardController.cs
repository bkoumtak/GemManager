using Microsoft.AspNetCore.Mvc;
using MediatR;
using System.Threading.Tasks;
using System;
using GemManager.Commands;
using GemManager.Models;
using GemManager.Repositories;
using GemManager.Enumerations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Infrastructure;

namespace GemManager.Controllers
{
    [Authorize]
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
        public async Task<bool> RobinHood(string source, string target)
        {
            var sourceGuid = Guid.Parse(source);
            var targetGuid = Guid.Parse(target);

            return await _mediator.Send(new RobinHoodCommand(Request, sourceGuid, targetGuid));
        }

        [Route("self_hug/{gems}")]
        public async Task<bool> SelfHug(string gems)
        {
            var gemsToGive = Int32.Parse(gems);
            return await _mediator.Send(new SelfHugCommand(Request, gemsToGive)); 
        }

        [Route("steal_gem/{target}")]
        public async Task<bool> StealGem(string target)
        {
            var targetGuid = Guid.Parse(target); 
            return await _mediator.Send(new StealGemCommand(Request, targetGuid));
        }

        [Route("steal_card/{target}/{card}")]
        public async Task<bool> StealCard(string target, string card)
        {
            var targetGuid = Guid.Parse(target);
            var cardType = (CardType)Int32.Parse(card);
            return await _mediator.Send(new StealCardCommand(Request, targetGuid, cardType));
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