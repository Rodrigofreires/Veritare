using Aisentona.Entities.Interfaces;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aisentona.Biz.Services
{
    public class TokenBlacklistService : ITokenBlacklistService
    {
        private readonly Dictionary<string, DateTime> _blacklist = new();

        public void AddToBlacklist(string token)
        {
            // Decodificar o token para obter sua data de expiração
            var expirationDate = DecodeTokenExpiration(token);
            if (expirationDate != null)
            {
                _blacklist[token] = expirationDate.Value;
            }
        }

        public bool IsTokenBlacklisted(string token)
        {
            CleanupExpiredTokens(); // Remove tokens expirados antes de verificar
            return _blacklist.ContainsKey(token);
        }

        public void CleanupExpiredTokens()
        {
            var now = DateTime.UtcNow;
            var expiredTokens = _blacklist
                .Where(kv => kv.Value < now)
                .Select(kv => kv.Key)
                .ToList();

            foreach (var token in expiredTokens)
            {
                _blacklist.Remove(token);
            }
        }

        private DateTime? DecodeTokenExpiration(string token)
        {
            try
            {
                var handler = new JwtSecurityTokenHandler();
                var jwtToken = handler.ReadToken(token) as JwtSecurityToken;
                return jwtToken?.ValidTo;
            }
            catch
            {
                return null;
            }
        }
    }
}
