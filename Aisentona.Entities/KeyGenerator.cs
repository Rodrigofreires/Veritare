using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Aisentona.Entities
{
    public class KeyGenerator
    {
        public static string GenerateKey(int size = 32)
        {
            var key = new byte[size];
            using (var generator = RandomNumberGenerator.Create())
            {
                generator.GetBytes(key);
                return Convert.ToBase64String(key);
            }
        }
    }
}
