using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Aisentona.DataBase
{
    public class Colaborador
    {
            public Colaborador()
            {
            }

            public Colaborador(int id_usuario, string nm_Nome, string ds_Cpf, string ds_Senha, bool fl_Ativo, DateTime dt_Criacao, DateTime dt_UltimaAlteracao, int id_TipoUsuario, string ds_UltimaAlteracao)
            {
                Id_Usuario = id_usuario;
                Nm_Nome = nm_Nome;
                Ds_CPF = ds_Cpf;
                DS_Senha = ds_Senha;
                Fl_Ativo = fl_Ativo;
                DT_Criacao = dt_Criacao;
                DT_UltimaAlteracao = dt_UltimaAlteracao;
                Id_TipoUsuario = id_TipoUsuario;
                Ds_UltimaAlteracao = ds_UltimaAlteracao;
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
            public virtual ColaboradorTipoUsuario? TipoUsuario { get; set; }
            public virtual ColaboradorPermissao? Permissoes { get; set; }
            
        }
    }