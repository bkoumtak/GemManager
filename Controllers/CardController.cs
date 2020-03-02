using Microsoft.AspNetCore.Mvc;
using MediatR;
using System.Threading.Tasks;
using System;
using GemManager.Commands;
using GemManager.Models;
using GemManager.Repositories; 

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
        public async Task<bool> Get(string source, string target)
        {
            var sourceGuid = Guid.Parse(source);
            var targetGuid = Guid.Parse(target);

            return await _mediator.Send(new RobinHoodCommand(Request, sourceGuid, targetGuid));
        }

        [Route("self_hug/{gems}")]
        public async Task<bool> Get(string gems)
        {
            var gemsToGive = Int32.Parse(gems);
            return await _mediator.Send(new SelfHugCommand(Request, gemsToGive)); 
        }


    }
}