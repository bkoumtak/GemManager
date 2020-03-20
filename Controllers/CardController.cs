using Microsoft.AspNetCore.Mvc;
using MediatR;
using System.Threading.Tasks;
using System;
using GemManager.Commands;
using GemManager.Models;
using GemManager.Repositories;
using GemManager.Enumerations;
using Microsoft.AspNetCore.Authorization;

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
        public async Task<bool> DoubleReceive(string target, int week)
        {
            var targetGuid = Guid.Parse(target);

            return await _mediator.Send(new DoubleReceiveCommand(Request, targetGuid, week));
        }

        [Route("double_send")]
        public async Task<bool> DoubleSend()
        {
            return await _mediator.Send(new DoubleSendCommand(Request));
        }

        [Route("revive")]
        public async Task<bool> Revive()
        {
            return await _mediator.Send(new ReviveCommand(Request));
        }

        [Route("malediction/{target}/{week}")]
        public async Task<bool> Malediction(string target, int week)
        {
            return await _mediator.Send(new MaledictionCommand(Request, Guid.Parse(target), week));
        }
    }
}