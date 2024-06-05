namespace Aisentona.DataBase
{
    public class Colaborador
    {
        public Colaborador()
        {
            
        }

        public Colaborador(int id_Colaborador, string nm_Nome, string ds_Cpf, string ds_Senha, bool fl_Ativo, DateTime dt_Criacao, DateTime dt_UltimaAlteracao, int id_TipoUsuario, string ds_UltimaAlteracao, ICollection<ColaboradorEmail>? emails, ICollection<ColaboradorTelefone>? telefones, ColaboradorTipoUsuario? tipoUsuario, ICollection<ColaboradorPermissao>? permissoes)
        {
            Id_Colaborador = id_Colaborador;
            Nm_Nome = nm_Nome;
            Ds_CPF = ds_Cpf;
            DS_Senha = ds_Senha;
            Fl_Ativo = fl_Ativo;
            DT_Criacao = dt_Criacao;
            DT_UltimaAlteracao = dt_UltimaAlteracao;
            Id_TipoUsuario = id_TipoUsuario;
            Ds_UltimaAlteracao = ds_UltimaAlteracao;
            Emails = emails;
            Telefones = telefones;
            TipoUsuario = tipoUsuario;
            Permissoes = permissoes;      
        }

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
        public ICollection<ColaboradorPermissao>? Permissoes { get; set; }
    }
}