using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aisentona.Entities
{
    public static class Configuration
    {
        public static string PrivateKey = Environment.GetEnvironmentVariable("JWT_PRIVATE_KEY");

    }

        
        
}
