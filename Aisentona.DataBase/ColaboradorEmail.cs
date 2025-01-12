using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.Design;

namespace Aisentona.DataBase
{
    public class ColaboradorEmail
    {
        public ColaboradorEmail()
        {
        }

        public ColaboradorEmail(int idEmail, string dsEmail, string dsDescricao, bool flAtivo, DateTime? dt_Criacao, DateTime dtUltimaAlteracao, string? ds_UltimaAlteracao, int idUsuario)
        {
            Id_Email = idEmail;
            Ds_Email = dsEmail;
            Fl_Ativo = flAtivo;
            DT_Criacao = dt_Criacao;
            DT_UltimaAlteracao = dtUltimaAlteracao;
            Ds_UltimaAlteracao = ds_UltimaAlteracao;
            Id_Usuario = idUsuario;
            Ds_Descricao = dsDescricao;
        }

        [Key]
        public int Id_Email { get; set; }
        public string Ds_Email { get; set; }
        public string Ds_Descricao { get; set; }

        public bool Fl_Ativo { get; set; }
        public DateTime? DT_Criacao { get; set; } = DateTime.UtcNow;
        public DateTime DT_UltimaAlteracao { get; set; } = DateTime.UtcNow;
        public string? Ds_UltimaAlteracao { get; set; }

        // Relacionamento com a tabela de Colaboradores
        [ForeignKey("Colaborador")]
        public int Id_Usuario { get; set; }
        public virtual Colaborador? Colaborador { get; set; }
    }
}
