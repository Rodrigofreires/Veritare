using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aisentona.DataBase
{
    public class Postagem
    {
        public Postagem(int id_Postagem, string titulo, string conteudo, int id_Usuario, DateTime dT_Criacao, DateTime dT_UltimaAlteracao, int id_Status)
        {
            Id_Postagem = id_Postagem;
            Titulo = titulo;
            Conteudo = conteudo;
            Id_Usuario = id_Usuario;
            DT_Criacao = dT_Criacao;
            DT_UltimaAlteracao = dT_UltimaAlteracao;
            Id_Status = id_Status;
        }

        [Key]
        public required int Id_Postagem { get; set; }
        public required string Titulo { get; set; }
        public required string Conteudo { get; set; }

        [ForeignKey("Colaborador")]
        public required int Id_Usuario { get; set; }
        public required DateTime DT_Criacao {get; set;}
        public required DateTime DT_UltimaAlteracao { get; set; }
        public required int Id_Status { get; set; }
        public required Colaborador Colaborador { get; set; } // Relação com a classe Usuario (CF_COLABORADOR)
        public required Status Status { get; set; }   // Relação com a classe Status
      
    }
}
