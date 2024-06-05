namespace Aisentona.DataBase
{
    public class ColaboradorEmail
    {
        public ColaboradorEmail()
        {
            
        }
        public ColaboradorEmail(int id_Email, string ds_Email, bool fl_Ativo, DateTime? dt_Criacao, DateTime dt_UltimaAlteracao, string ds_UltimaAlteracao, int id_Colaborador, Colaborador colaborador)
        {
            Id_Email = id_Email;
            Ds_Email = ds_Email;
            Fl_Ativo = fl_Ativo;
            DT_Criacao = dt_Criacao;
            DT_UltimaAlteracao = dt_UltimaAlteracao;
            Ds_UltimaAlteracao = ds_UltimaAlteracao;
            Id_Colaborador = id_Colaborador;
            Colaborador = colaborador;
        }


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