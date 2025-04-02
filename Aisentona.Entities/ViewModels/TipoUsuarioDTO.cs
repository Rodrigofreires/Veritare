using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aisentona.Entities.ViewModels
{
    public class TipoUsuarioDTO
    {
        public TipoUsuarioDTO()
        {
        }

        public TipoUsuarioDTO(int id, string nome)
        {
            this.id = id;
            this.nome = nome;
        }

        public int id { get; set; }
        public string nome { get; set; }

    }
}
