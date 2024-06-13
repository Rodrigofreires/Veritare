using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Aisentona.DataBase
{
    public class ColaboradorTelefone
    {
        public ColaboradorTelefone()
        {
            
        }

        public ColaboradorTelefone(int id_Telefone, string nm_Apelido, string ds_Numero, bool fl_Ativo, DateTime? dt_Criacao, DateTime? dt_UltimaAlteracao, string? ds_UltimaAlteracao, int id_Usuario)
        {
            Id_Telefone = id_Telefone;
            Nm_Apelido = nm_Apelido;
            Ds_Numero = ds_Numero;
            Fl_Ativo = fl_Ativo;
            DT_Criacao = dt_Criacao;
            DT_UltimaAlteracao = dt_UltimaAlteracao;
            Ds_UltimaAlteracao = ds_UltimaAlteracao;
            Id_Usuario = id_Usuario;
        }

        [Key]
        public int Id_Telefone { get; set; }

        [Required]
        public string Nm_Apelido { get; set; }
        
        [Required]
        public string Ds_Numero { get; set; }
        public bool Fl_Ativo { get; set; }
        public DateTime? DT_Criacao { get; set; } = DateTime.UtcNow;
        public DateTime? DT_UltimaAlteracao { get; set; } = DateTime.UtcNow;
        public string? Ds_UltimaAlteracao { get; set; }

        // Relacionamento com a tabela de Colaboradores

        [ForeignKey("Colaborador")]
        public int Id_Usuario { get; set; }
        public virtual Colaborador? Colaborador { get; set; }
    }
}