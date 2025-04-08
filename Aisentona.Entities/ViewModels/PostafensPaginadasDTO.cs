using Aisentona.Entities.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aisentona.Entities.ViewModels
{
    public class PostagensPaginadasDTO
    {
        public int Total { get; set; }
        public required List<PostagemRequest> Dados { get; set; }
    }

}
