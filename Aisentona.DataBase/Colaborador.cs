using System.ComponentModel.DataAnnotations;

namespace Aisentona.DataBase
{
    public class Colaborador
    {
        public Colaborador()
        {
        }
        public Colaborador(int idUsuario, string nome, string cpf, string email, byte[] passwordHash, byte[] passwordSalt, bool flAtivo, DateTime? dtCriacao, DateTime? dtUltimaAlteracao, int idTipoUsuario, string dsUltimaAlteracao, DateTime? dtNascimento, string ds_ContatoCadastro, string? tokenAtivacao, DateTime? tokenAtivacaoExpiracao, string? tokenRedefinirSenhaAtivacao, DateTime? tokenRedefinirSenhaAtivacaoExpiracao)
        {
            Id_Usuario = idUsuario;
            Nm_Nome = nome;
            Ds_CPF = cpf;
            Ds_Email = email;
            PasswordHash = passwordHash;
            PasswordSalt = passwordSalt;
            Fl_Ativo = flAtivo;
            Token_Ativacao = tokenAtivacao;
            Token_AtivacaoExpiracao = tokenAtivacaoExpiracao;
            Token_Redefinir_SenhaAtivacao = tokenRedefinirSenhaAtivacao;
            Token_Redefinir_SenhaAtivacaoExpiracao = tokenRedefinirSenhaAtivacaoExpiracao;
            DT_Criacao = dtCriacao;
            DT_UltimaAlteracao = dtUltimaAlteracao;
            DT_Nascimento = dtNascimento;
            Id_TipoUsuario = idTipoUsuario;
            Ds_UltimaAlteracao = dsUltimaAlteracao;
            Ds_ContatoCadastro = ds_ContatoCadastro;
        }


        [Key]
        public int Id_Usuario { get; set; }
        public string Nm_Nome { get; set; }
        public string Ds_CPF { get; set; }
        public string Ds_ContatoCadastro {  get; set; }
        public string Ds_Email {  get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public string? Token_Ativacao { get; set; }
        public DateTime? Token_AtivacaoExpiracao { get; set; }
        public string? Token_Redefinir_SenhaAtivacao { get; set; }
        public DateTime? Token_Redefinir_SenhaAtivacaoExpiracao { get; set; }
        public bool Fl_Ativo { get; set; } = false;
        public DateTime? DT_Nascimento { get; set; } 
        public DateTime? DT_Criacao { get; set; } 
        public DateTime? DT_UltimaAlteracao { get; set; }
        [Required]
        public int Id_TipoUsuario { get; set; }
        public string Ds_UltimaAlteracao { get; set; }
        // Propriedades de navegação
        public virtual ColaboradorTelefone? Telefones { get; set; }

        public virtual AcessoUsuario? AcessoUsuario { get; set; }

        public virtual ColaboradorTipoUsuario? TipoUsuario { get; set; }

        public virtual ICollection<Postagem> Postagem { get; set; }


    }

}
