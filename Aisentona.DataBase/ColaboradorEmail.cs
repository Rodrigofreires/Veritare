namespace Aisentona.DataBase
{
    public class ColaboradorEmail
    {
        public int Id_Email { get; set; }
        public string Ds_Email { get; set; }
        public bool Fl_Ativo { get; set; }
        public DateTime? DT_Criacao { get; set; }
        public DateTime DT_UltimaAlteracao { get; set; }
        public string Ds_UltimaAlteracao { get; set; }
       
        // Relacionamento com a tabela de Colaboradores
        public int Id_Colaborador { get; set; }
        public Colaborador Colaborador { get; set; }
    }
}