using System;
using System.Linq;
using GemManager.Models;
using GemManager.Repositories;
using Microsoft.AspNetCore.Http;

namespace GemManager.Controllers
{
    public class ValidationHelper
    {
        private static IRepository<User> _userRepository;

        public ValidationHelper(IRepository<User> userRepository)
        {
            _userRepository = userRepository;
        }

        public static void ValidateUser(HttpRequest request, out Guid userGuid, out string userRole)
        {
            var usersFromDb = _userRepository.GetAll();
            User user = usersFromDb.SingleOrDefault(x => 
                x.Username == request.HttpContext.User.Identity.Name.Replace("GENETEC\\", String.Empty));
            userGuid = user.Id;
            userRole = user.Role;
        }
    }
}