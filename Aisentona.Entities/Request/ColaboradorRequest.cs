using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace Aisentona.Entities.Request
{
        public class ColaboradorRequest
        {

            public ColaboradorRequest() { } 
            public ColaboradorRequest(string nome, string cpf, string celular, string senha, DateTime dataNascimento)
            {
                Nome = nome;
                CPF = cpf;
                Celular = celular;
                Senha = senha;
                DataNascimento = dataNascimento;
            }

            public string Nome { get; set; }
            public string CPF { get; set; }
            public string Email { get; set; }
            public string Celular {  get; set; }
            public string Senha { get; set; }
            public DateTime DataNascimento { get; set; }
            public bool Ativo { get; set; }

        }
}


