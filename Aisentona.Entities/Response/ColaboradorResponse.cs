using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aisentona.Entities.Response
{
    public class ColaboradorResponse
    {

        public ColaboradorResponse() { }
        public ColaboradorResponse(string nome, string cpf, string email, string celular, string senha, DateTime dataNascimento)
        {
            Nome = nome;
            CPF = cpf;
            Email = email;
            Celular = celular;
            Senha = senha;
            DataNascimento = dataNascimento;
        }

        public string Nome { get; set; }
        public string CPF { get; set; }
        public string Email { get; set; }
        public string Celular { get; set; }
        public string Senha { get; set; }
        public DateTime DataNascimento { get; set; }

    }
}
