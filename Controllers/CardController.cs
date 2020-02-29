using Microsoft.AspNetCore.Mvc;
using GemManager.Models;
using GemManager.Repositories;

namespace GemManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CardController : ControllerBase
    {
        private readonly IGemRepository _gemRepository;
        private readonly IRepository<User> _userRepository;

        public CardController(IGemRepository gemRepository, IRepository<User> userRepository)
        {
            _gemRepository = gemRepository;
            _userRepository = userRepository;
        }

        

    }
}