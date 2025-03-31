using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aisentona.Entities.Request
{

    public class RedefinirSenhaRequest
    {
        public RedefinirSenhaRequest()
        {
        }
        public RedefinirSenhaRequest(string token, string novaSenha, string confirmarSenha)
        {
            Token = token;
            NovaSenha = novaSenha;
            ConfirmarSenha = confirmarSenha;
        }

        public string Token { get; set; }
        public string NovaSenha { get; set; }
        public string ConfirmarSenha { get; set; }
    }
}
