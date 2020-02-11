using System;
using System.Collections.Generic;
using System.DirectoryServices.AccountManagement;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using GemManager.Helpers;
using GemManager.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Tokens;

namespace GemManager.Services
{
    public interface IUserService
    {
        User Authenticate(string username, string password);
        IEnumerable<User> GetAll();
    }

    public class UserService : IUserService
    {
        // users hardcoded for simplicity, store in a db with hashed passwords in production applications
        private List<User> _users = new List<User>
            {
                new User { Id = 1, FirstName = "Test", LastName = "User", Username = "test", Password = "test", Role = "Admin"}
            };

        private readonly AppSettings _appSettings;

        public UserService(IOptions<AppSettings> appSettings)
        {
            _appSettings = appSettings.Value;
        }

        public User Authenticate(string username, string password)
        {
            //var user = _users.SingleOrDefault(x => x.Username == username && x.Password == password);

            //// return null if user not found
            //if (user == null)
            //    return null;
            using (var adContext = new PrincipalContext(ContextType.Domain, "genetec.com"))
            {
                var result = adContext.ValidateCredentials(username, password, ContextOptions.Signing);

                if (result)
                {
                    GetAll();

                    UserPrincipal u = UserPrincipal.FindByIdentity(adContext, username);
                    IdentityModelEventSource.ShowPII = true;

                    // authentication successful so generate jwt token
                    var tokenHandler = new JwtSecurityTokenHandler();
                    var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
                    var tokenDescriptor = new SecurityTokenDescriptor
                    {
                        Subject = new ClaimsIdentity(new Claim[]
                        {
                            new Claim(ClaimTypes.Name, username)
                        }),
                        Expires = DateTime.UtcNow.AddDays(7),
                        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),
                            SecurityAlgorithms.HmacSha256Signature),
                        Issuer = "genetec.com",
                        Audience = "genetec.com"
                    };
                    var token = tokenHandler.CreateToken(tokenDescriptor);

                    var user = new User()
                    {
                        Token = tokenHandler.WriteToken(token)
                    };

                    return user.WithoutPassword();
                }

                return null;
            }
        }

        public IEnumerable<User> GetAll()
        {
            return _users.WithoutPasswords();
        }
    }

}