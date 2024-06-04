namespace Aisentona.DataBase
{
    public class Colaborador
    {
        public int Id_Colaborador { get; set; }
        public string? Nm_Nome { get; set; }
        public string? Ds_CPF { get; set; }
        public string? DS_Senha { get; set; }
        public bool Fl_Ativo { get; set; }
        public DateTime? DT_Criacao { get; set; }
        public DateTime DT_UltimaAlteracao { get; set; }
        public int Id_TipoUsuario { get; set; }
        public string? Ds_UltimaAlteracao { get; set; }
        // Navigation properties
        public ICollection<ColaboradorEmail>? Emails { get; set; }
        public ICollection<ColaboradorTelefone>? Telefones { get; set; }
        public ColaboradorTipoUsuario? TipoUsuario { get; set; }
        public ICollection<ColaboradorPermissao> Permissoes { get; set; }
    }
}