using Microsoft.AspNetCore.Mvc;
using MediatR;
using System.Threading.Tasks;
using System;
using GemManager.Commands;
using GemManager.Models;
using GemManager.Repositories;
using GemManager.Enumerations;

namespace GemManager.Controllers
{
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

        [HttpPost]
        public ActionResult Post(Card card)
        {
            _cardRepository.Save(card);
            return Ok();
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
            Enum.TryParse(card, out CardType cardType);
            return await _mediator.Send(new StealCardCommand(Request, targetGuid, cardType));
        }
    }
}