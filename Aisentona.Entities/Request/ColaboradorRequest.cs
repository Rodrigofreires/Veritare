using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aisentona.Entities.Request
{
    public class ColaboradorRequest
    {
        public string Nome { get; set; }
        public string CPF { get; set; }
        public string Senha { get; set; }
        public int TipoUsuario { get; set; }
    }
}
