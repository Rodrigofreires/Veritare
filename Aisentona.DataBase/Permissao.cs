namespace Aisentona.DataBase
{
    public class Permissao
    {
        public Permissao()
        {
            
        }
        public Permissao(int id_Permissao, string nm_Permissao)
        {
            Id_Permissao = id_Permissao;
            Nm_Permissao = nm_Permissao;
        }

        public int Id_Permissao { get; set; }
        public string Nm_Permissao { get; set; }
    }
}