using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using Microsoft.AspNetCore.Http;

namespace GemManager.Controllers
{
    public static class ValidationHelper
    {
        public static void ValidateUser(HttpRequest request, out Guid userGuid, out string userRole)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            string jwtToken = request.Headers["Authorization"].ToString();
            string jwtTokenWithNoBearer = jwtToken.Substring(jwtToken.IndexOf(" ", StringComparison.Ordinal) + 1);
            var decodedJwt = tokenHandler.ReadJwtToken(jwtTokenWithNoBearer);
            Guid.TryParse(decodedJwt.Claims.SingleOrDefault(k => k.Type.Equals("nameid"))?.Value, out userGuid);
            userRole = decodedJwt.Claims.SingleOrDefault(k => k.Type.Equals("role"))?.Value;
        }
    }
}