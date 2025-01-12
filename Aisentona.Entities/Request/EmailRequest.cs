using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aisentona.Entities.Request
{
    public class EmailRequest
    {
        public EmailRequest()
        {
            
        }
        public EmailRequest(string email, string descricao, int usuarioId)
        {
            Email = email;
            Descricao = descricao;
            UsuarioId = usuarioId;
        }

        public string Email { get; set; }
        public string Descricao {  get; set; }
        public int UsuarioId { get; set;}

    }
}
