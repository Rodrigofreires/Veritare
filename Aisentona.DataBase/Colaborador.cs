﻿using Aisentona.DataBase.Aisentona.DataBase;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Aisentona.DataBase
{
    public class Colaborador
    {
        public Colaborador()
        {
        }
        public Colaborador(int idUsuario, string nome, string cpf, string email, byte[] passwordHash, byte[] passwordSalt, bool flAtivo, DateTime dtCriacao, DateTime dtUltimaAlteracao, int idTipoUsuario, string dsUltimaAlteracao, DateTime dtNascimento, string ds_ContatoCadastro)
        {
            Id_Usuario = idUsuario;
            Nm_Nome = nome;
            Ds_CPF = cpf;
            Ds_Email = email;
            PasswordHash = passwordHash;
            PasswordSalt = passwordSalt;
            Fl_Ativo = flAtivo;
            DT_Criacao = AjustarData(dtCriacao);
            DT_UltimaAlteracao = AjustarData(dtUltimaAlteracao);
            DT_Nascimento = AjustarData(dtNascimento);
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
        public bool Fl_Ativo { get; set; }
        public DateTime DT_Nascimento { get; set; } 
        public DateTime DT_Criacao { get; set; } 
        public DateTime DT_UltimaAlteracao { get; set; }
        [Required]
        public int Id_TipoUsuario { get; set; }
        public string Ds_UltimaAlteracao { get; set; }



        // Propriedades de navegação
        public virtual ColaboradorTelefone? Telefones { get; set; }
        //public virtual ColaboradorPermissao? Permissoes { get; set; }
        public virtual AcessoUsuario? AcessoUsuario { get; set; }

        public virtual ColaboradorTipoUsuario? TipoUsuario { get; set; }

        public virtual ICollection<Postagem> Postagem { get; set; }

        // Função auxiliar para ajustar datas
        private DateTime AjustarData(DateTime data)
        {
            return data < new DateTime(1753, 1, 1) ? new DateTime(1753, 1, 1) : data;
        }


    }

}
