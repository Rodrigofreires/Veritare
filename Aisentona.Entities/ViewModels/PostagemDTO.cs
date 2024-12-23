using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aisentona.Entities.ViewModels
{
    public class PostagemDTO
    {
        public PostagemDTO(string titulo, string descricao, string conteudo, int postagemId, int idCategoria, int idStatus, int idUsuario)
        {
            Titulo = titulo;
            Descricao = descricao;
            Conteudo = conteudo;
            PostagemId = postagemId;
            IdCategoria = idCategoria;
            IdStatus = idStatus;
            IdUsuario = idUsuario;
        }

        public string Titulo { get; set; }
        public string Descricao {  get; set; }
        public string Conteudo { get; set; }
        public int PostagemId { get; set; }
        public int IdCategoria { get; set; }
        public int IdStatus { get; set; }
        public int IdUsuario { get; set; }

    }
}
