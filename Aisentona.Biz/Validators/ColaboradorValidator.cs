using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Aisentona.DataBase;
using Aisentona.Entities.Request;
using Aisentona.Entities.Response;
using FluentValidation;

namespace Aisentona.Biz.Validators
{
    public class ColaboradorValidator : AbstractValidator<ColaboradorResponse>
    {
        public ColaboradorValidator() 
        {
            RuleFor(x => x.Nome) //Regras de Validação para o  Nome 
               .NotNull().WithMessage("O nome é obrigatório")
               .MinimumLength(3).WithMessage("Nome inválido, por favor, confira novamente.")
               .MaximumLength(50).WithMessage("Nome muito grande.");

            RuleFor(x => x.CPF)
                .NotEmpty().WithMessage("O campo CPF é obrigatório")
                .Must(x => ValidarCPF(x)).WithMessage("CPF inválido");


            RuleFor(x => x.Email) //Regras de Validação para Email
                .NotNull().WithMessage("O E-mail é obrigatório")
                .EmailAddress().WithMessage("Endereço de E-mail inválido")
                .Matches("^[^<>]*$").WithMessage("O e-mail não pode conter os caracteres '<' ou '>'.")
                .MaximumLength(254).WithMessage("O e-mail não pode ter mais de 254 caracteres.")
                .Must(email => !email.EndsWith("@tempmail.com")).WithMessage("E-mails temporários não são permitidos.");

        }

        // Faz a validação do CPF
        public bool ValidarCPF(string cpf)
        {
            if (string.IsNullOrEmpty(cpf))
                return true; // Validação de CPF em branco é tratada pela regra NotEmpty

            // Remove caracteres não numéricos
            cpf = new string(cpf.Where(char.IsDigit).ToArray());

            // Verifica se o tamanho é inválido ou se todos os números são iguais (caso inválido)
            if (cpf.Length != 11 || cpf.All(c => c == cpf[0]))
                return false;

            // Calcula os dígitos verificadores
            int[] pesos1 = { 10, 9, 8, 7, 6, 5, 4, 3, 2 };
            int[] pesos2 = { 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 };

            bool ValidarDigito(int[] numeros, int[] pesos, int digitoPosicao)
            {
                int soma = numeros.Take(digitoPosicao).Zip(pesos, (n, p) => n * p).Sum();
                int resto = soma % 11;
                int digito = resto < 2 ? 0 : 11 - resto;
                return numeros[digitoPosicao] == digito;
            }

            int[] numeros = cpf.Select(c => int.Parse(c.ToString())).ToArray();

            return ValidarDigito(numeros, pesos1, 9) && ValidarDigito(numeros, pesos2, 10);
        }



    }

}
    