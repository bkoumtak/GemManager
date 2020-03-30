using System;
using System.DirectoryServices.AccountManagement;
using System.Linq;
using System.Threading.Tasks;
using GemManager.Models;
using GemManager.Repositories;
using Microsoft.AspNetCore.Authorization;

namespace GemManager
{
    public class CheckForEmployeeHandler : AuthorizationHandler<CheckForEmployee>
    {
        private readonly IRepository<User> _userRepository;

        public CheckForEmployeeHandler(IRepository<User> userRepository)
        {
            _userRepository = userRepository;
        }
        
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, CheckForEmployee requirement)
        {
            using (var adContext = new PrincipalContext(ContextType.Domain, "genetec.com"))
            {
                var usersFromDb = _userRepository.GetAll();
                UserPrincipal userFromAd = UserPrincipal.FindByIdentity(adContext, context.User.Identity.Name.Replace("GENETEC\\", String.Empty));
                User user = usersFromDb.SingleOrDefault(x => x.Id == userFromAd?.Guid);

                if (user == null)
                {
                    user = new User()
                    {
                        Id = userFromAd.Guid.GetValueOrDefault(),
                        FirstName = userFromAd.GivenName,
                        LastName = userFromAd.Surname,
                        Name = userFromAd.Name,
                        Username = userFromAd.SamAccountName,
                        Role = "User"
                    };

                    _userRepository.Save(user);
                }

                context.Succeed(requirement);

            }

            return Task.CompletedTask;
        }
    }
}