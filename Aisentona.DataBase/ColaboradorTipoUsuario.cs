namespace Aisentona.DataBase
{
    public class ColaboradorTipoUsuario
    {
        public ColaboradorTipoUsuario()
        {
            
        }
        public ColaboradorTipoUsuario(int id_TipoUsuario, string nm_TipoUsuario, bool fl_Ativo, DateTime? dT_Criacao, DateTime dT_UltimaAlteracao)
        {
            Id_TipoUsuario = id_TipoUsuario;
            Nm_TipoUsuario = nm_TipoUsuario;
            Fl_Ativo = fl_Ativo;
            DT_Criacao = dT_Criacao;
            DT_UltimaAlteracao = dT_UltimaAlteracao;
        }

        public int Id_TipoUsuario { get; set; }
        public string Nm_TipoUsuario { get; set; }
        public bool Fl_Ativo { get; set; }
        public DateTime? DT_Criacao { get; set; }
        public DateTime DT_UltimaAlteracao { get; set; }
    }
}