using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aisentona.Entities.Request
{
    public class EmailPromptRequest
    {
        public EmailPromptRequest(string nome, string email)
        {
            Nome = nome;
            Email = email;
        }

        public required string Nome  { get; set; }
        public required string Email { get; set; }


    }
}
