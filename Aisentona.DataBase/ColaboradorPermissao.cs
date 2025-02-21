using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Aisentona.DataBase
{
    public class ColaboradorPermissao
    {
        public ColaboradorPermissao()
        {
            
        }

        public ColaboradorPermissao(int id_ColaboradorPermissao, DateTime? dT_Criacao, DateTime dT_UltimaAlteracao, string ds_UltimaAlteracao, int id_Usuario, int id_Permissao)
        {
            Id_ColaboradorPermissao = id_ColaboradorPermissao;
            DT_Criacao = dT_Criacao;
            DT_UltimaAlteracao = dT_UltimaAlteracao;
            Ds_UltimaAlteracao = ds_UltimaAlteracao;
            Id_Usuario = id_Usuario;
            Id_Permissao = id_Permissao;
        }

        [Key]
        public int Id_ColaboradorPermissao { get; set; }
        public DateTime? DT_Criacao { get; set; }
        public DateTime DT_UltimaAlteracao { get; set; }
        public string Ds_UltimaAlteracao { get; set; }

        // Relacionamento com a tabela de Colaboradores

        [ForeignKey("Colaborador")]
        public int Id_Usuario { get; set; }
        public virtual Colaborador Colaborador { get; set; }
        public int Id_Permissao { get; set; }


    }
}