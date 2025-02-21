using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aisentona.Entities.Request
{
    public class LogoutRequest
    {
        public LogoutRequest(string token)
        {
            Token = token;
        }

        public string Token { get; set; } 
    }
}
