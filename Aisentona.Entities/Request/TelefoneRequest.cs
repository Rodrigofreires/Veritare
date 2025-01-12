using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aisentona.Entities.Request
{
    public class TelefoneRequest
    {
        public TelefoneRequest()
        {
            
        }
        public TelefoneRequest(string tipo, string numeroContato, bool ativo, int usuarioID)
        {
            Apelido = tipo;
            NumeroContato = numeroContato;
            Ativo = ativo;
            UsuarioId = usuarioID;
        }
        public string Apelido { get; set; }
        public string NumeroContato { get; set; }
        public bool Ativo {  get; set; }
        public int UsuarioId { get; set; }

    }
}

