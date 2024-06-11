using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Aisentona.DataBase
{
    public class ColaboradorPermissao
    {
        public ColaboradorPermissao()
        {
            
        }
        public ColaboradorPermissao(int id_Telefone, string nm_Apelido, string ds_Numero, bool fl_Ativo, DateTime? dT_Criacao, DateTime dT_UltimaAlteracao, string ds_UltimaAlteracao, int id_Colaborador)
        {
            Id_Telefone = id_Telefone;
            Nm_Apelido = nm_Apelido;
            Ds_Numero = ds_Numero;
            Fl_Ativo = fl_Ativo;
            DT_Criacao = dT_Criacao;
            DT_UltimaAlteracao = dT_UltimaAlteracao;
            Ds_UltimaAlteracao = ds_UltimaAlteracao;
            Id_Colaborador = id_Colaborador;
        }

        [Key, ForeignKey("Colaborador")]
        public int Id_Telefone { get; set; }
        public string Nm_Apelido { get; set; }
        public string Ds_Numero { get; set; }
        public bool Fl_Ativo { get; set; }
        public DateTime? DT_Criacao { get; set; }
        public DateTime DT_UltimaAlteracao { get; set; }
        public string Ds_UltimaAlteracao { get; set; }
        
        // Relacionamento com a tabela de Colaboradores
        public int Id_Colaborador { get; set; }
        public virtual Colaborador Colaborador { get; set; }
    }
}