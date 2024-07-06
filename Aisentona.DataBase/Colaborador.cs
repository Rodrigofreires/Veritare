using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Aisentona.DataBase
{
    public class Colaborador
    {
            public Colaborador()
            {
            }

            public Colaborador(int idUsuario, string nome, string cpf, string senha, bool flAtivo, DateTime dtCriacao, DateTime dtUltimaAlteracao, int idTipoUsuario, string dsUltimaAlteracao)
            {
                Id_Usuario = idUsuario;
                Nm_Nome = nome;
                Ds_CPF = cpf;
                DS_Senha = senha;
                Fl_Ativo = flAtivo;
                DT_Criacao = dtCriacao;
                DT_UltimaAlteracao = dtUltimaAlteracao;
                Id_TipoUsuario = idTipoUsuario;
                Ds_UltimaAlteracao = dsUltimaAlteracao;
            }

            [Key]
            public int Id_Usuario { get; set; }
            public string Nm_Nome { get; set; }
            public string Ds_CPF { get; set; }
            public string DS_Senha { get; set; }
            public bool Fl_Ativo { get; set; }
            public DateTime DT_Criacao { get; set; } = DateTime.UtcNow;
            public DateTime DT_UltimaAlteracao { get; set; } = DateTime.UtcNow;
            [Required]  
            public int Id_TipoUsuario { get; set; }
            public string Ds_UltimaAlteracao { get; set; }

            // Propriedades de navegação
            public virtual ColaboradorEmail? Emails { get; set; }
            public virtual ColaboradorTelefone? Telefones { get; set; }
            public virtual ColaboradorPermissao? Permissoes { get; set; }
            ICollection<Postagem> Postagem { get; set; }

    }
    }