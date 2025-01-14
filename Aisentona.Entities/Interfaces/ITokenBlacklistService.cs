using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aisentona.Entities.Interfaces
{
    public interface ITokenBlacklistService
    {
        void AddToBlacklist(string token);
        bool IsTokenBlacklisted(string token);
        void CleanupExpiredTokens();
    }
}
