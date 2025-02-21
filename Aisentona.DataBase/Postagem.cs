using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aisentona.DataBase
{
    public class Postagem
    {
        public Postagem()
        {
        }
        public Postagem(string titulo, string conteudo, string descricao, int idStatus, int idCategoria, DateTime dtCriacao, DateTime? dtUltimaAlteracao, string dsUltimaAlteracao, bool flAtivo, bool flPremium)
        {
            Titulo = titulo;
            Descricao = descricao;
            Conteudo = conteudo;
            Id_Status = idStatus;
            Id_Categoria = idCategoria;
            DT_Criacao = dtCriacao;
            DT_UltimaAlteracao = dtUltimaAlteracao;
            Ds_UltimaAlteracao = dsUltimaAlteracao;
            Fl_Ativo = flAtivo;
            Fl_Premium = flPremium;
        }


        [Key]
        public  int Id_Postagem { get; set; }
        public  string Titulo { get; set; }
        public  string Conteudo { get; set; }
        public string Descricao { get; set; }
        public string Imagem_base64 { get; set; }
        public string Texto_alterado_por_ia { get; set; }
        public string Palavras_retiradas_por_ia { get; set; }
        public  bool Fl_Ativo { get; set; }
        public string Ds_UltimaAlteracao { get; set; }
        public bool Fl_Premium { get; set; }

        [ForeignKey("Colaborador")]
        public  int Id_Usuario { get; set; }
        [ForeignKey("Status")]
        public  int Id_Status { get; set; }
        
        [ForeignKey("Categoria")]
        public  int Id_Categoria { get; set; }
        public DateTime? DT_Criacao {get; set;} = DateTime.Now;
        public DateTime? DT_UltimaAlteracao { get; set; }
        public Colaborador? Colaborador { get; set; } // Relação com a classe Usuario (CF_COLABORADOR)
        public Status? Status { get; set; }   // Relação com a classe Status
        public Categoria? Categoria { get; set; }  // Relação com a classe Categoria
      
    }
}
