using Aisentona.Enumeradores;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aisentona.Entities
{
    public static class RegrasAutorizacao
    {
        public static List<string> GetPermissions(this Autorizacao regras)
        {
            return regras switch
            {
                Autorizacao.Administrador => new List<string>()
                {
                    "VisualizarCategoriasOcultas",
                    "VisualizarProjetosEmDesenvolvimento",
                    "ExcluirPostsSimples",
                    "ExcluirPostsPremium",
                    "EditarPostsSimples",
                    "EditarPostsPremium",
                    "CadastrarPostsSimples",
                    "CadastrarPostsPremium",
                    "AlterarCategoria",
                    "AlterarTags",
                    "AlterarStatus",
                    "VisualizarPostsComuns",
                    "VisualizarPostsPremium",
                    "Comentar",
                    "Compartilhar",
                    "EditarUsuario"
                },
                Autorizacao.EditorChefe => new List<string>
                {
                    "ExcluirPostsSimples",
                    "ExcluirPostsPremium",
                    "EditarPostsSimples",
                    "EditarPostsPremium",
                    "CadastrarPostsSimples",
                    "CadastrarPostsPremium",
                    "AlterarCategoria",
                    "AlterarTags",
                    "AlterarStatus",
                    "VisualizarPostsComuns",
                    "VisualizarPostsPremium",
                    "Comentar",
                    "Compartilhar"
                },
                Autorizacao.EditorBase => new List<string>
                {
                    "EditarPostsSimples",
                    "EditarPostsPremium",
                    "CadastrarPostsSimples",
                    "CadastrarPostsPremium",
                    "AlterarCategoria",
                    "AlterarTags",
                    "VisualizarPostsComuns",
                    "VisualizarPostsPremium",
                    "Comentar",
                    "Compartilhar"
                },
                Autorizacao.LeitorPremium => new List<string>
                {
                    "VisualizarPostsComuns",
                    "VisualizarPostsPremium",
                    "Comentar",
                    "Compartilhar"
                },
                Autorizacao.LeitorSimples => new List<string>
                {
                    "VisualizarPostsComuns",
                    "Comentar",
                    "Compartilhar"
                },
                Autorizacao.Escritor => new List<string>
                {
                    "VisualizarPostsComuns",
                    "VisualizarPostsPremium",
                    "CadastrarPostsSimples",
                    "CadastrarPostsPremium",
                    "Comentar",
                    "Compartilhar"
                },
                _ => new List<string>()
            };
        }
    }
}
            
       
