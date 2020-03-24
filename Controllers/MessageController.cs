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
    public class MessageController : ControllerBase
    {
        private readonly IRepository<Message> _messageRepository;

        public MessageController(IRepository<Message> messageRepository)
        {
            _messageRepository = messageRepository;
        }

        [HttpGet]
        public ActionResult GetAll()
        {
            var messages = _messageRepository.GetAll();
            return Ok(messages);
        }
    }
}