using Aisentona.DataBase.Aisentona.DataBase;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aisentona.Entities.Request
{
    public class PerfilDeUsuarioRequest
    {
        public PerfilDeUsuarioRequest()
        {
            
        }
        public PerfilDeUsuarioRequest(string nome, string email, string contato, string nomeTipoDeUsuario, int idTipoUsuario,  DateTime tempoDeAcesso, DateTime dataDeNascimento, string endereco, string cpf, bool acessoPremium, DateTime? premiumExpiraEm, int idUsuario)
        {

            IdUsuario = idUsuario;
            Nome = nome;
            Email = email;
            Contato = contato;
            NomeTipoDeUsuario = nomeTipoDeUsuario;
            IdTipoUsuario = idTipoUsuario;
            TempoDeAcesso = tempoDeAcesso;
            DataDeNascimento = dataDeNascimento;
            Endereco = endereco;
            CPF = cpf;
            AcessoPremium = acessoPremium;
            PremiumExpiraEm = premiumExpiraEm;
        }
        public int IdUsuario { get; set; }
        public string Nome { get; set; }
        public string CPF { get; set; }
        public string Email { get; set; }
        public string Contato { get; set; }
        public string NomeTipoDeUsuario { get; set; }
        public int IdTipoUsuario { get; set; }
        public string? Endereco { get; set; }
        public DateTime? DataDeNascimento { get; set; } // Nullable
        public DateTime? TempoDeAcesso { get; set; }
        public bool? AcessoPremium { get; set; } // Nullable
        public DateTime? PremiumExpiraEm { get; set; } // Nullable

    }

}

