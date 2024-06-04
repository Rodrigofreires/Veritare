namespace Aisentona.DataBase
{
    public class ColaboradorPermissao
    {
        public int Id_Telefone { get; set; }
        public string Nm_Apelido { get; set; }
        public string Ds_Numero { get; set; }
        public bool Fl_Ativo { get; set; }
        public DateTime? DT_Criacao { get; set; }
        public DateTime DT_UltimaAlteracao { get; set; }
        public string Ds_UltimaAlteracao { get; set; }
        
        // Relacionamento com a tabela de Colaboradores
        public int Id_Colaborador { get; set; }
        public Colaborador Colaborador { get; set; }
    }
}