using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aisentona.Entities.Response
{
    public class PerfilDeUsuarioResponse
    {
        public PerfilDeUsuarioResponse()
        {
        }
        public PerfilDeUsuarioResponse(string nome, string email, string contato, string tipoDeUsuario, DateTime tempoDeAcesso, DateTime dataDeNascimento, string endereco, string cpf, bool acessoPremium, DateTime? premiumExpiraEm, int idUsuario)
        {

            IdUsuario = idUsuario;
            Nome = nome;
            Email = email;
            Contato = contato;
            TipoDeUsuario = tipoDeUsuario;
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
        public string TipoDeUsuario { get; set; }
        public string Endereco { get; set; }
        public bool AcessoPremium { get; set; }
        public DateTime TempoDeAcesso { get; set; }
        public DateTime DataDeNascimento { get; set; }
        public DateTime? PremiumExpiraEm { get; set; }


    }
}
