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

            RuleFor(x => x.CPF) //Regras de Validação para o CPF
                .NotEmpty().WithMessage("O campo CPF é obrigatório")
                .Must(x => ValidarCPF(x)).WithMessage("CPF inválido")
                .NotEmpty().WithMessage("O nome do usuário é obrigatório");

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
                return true; // Validação de CPF em branco é tratada pela regra NotEmpty acima

            // Remove caracteres não numéricos
            cpf = new string(cpf.Where(char.IsDigit).ToArray());

            if (cpf.Length != 11)
                return false;

            // Faz a validação do CPF
            int[] numeros = cpf.Select(c => int.Parse(c.ToString())).ToArray();
            int soma1 = 0, soma2 = 0;

            for (int i = 0; i < 9; i++)
            {
                soma1 += numeros[i] * (10 - i);
                soma2 += numeros[i] * (11 - i);
            }

            int resto1 = soma1 % 11;
            int digito1 = resto1 < 2 ? 0 : 11 - resto1;

            soma2 += digito1 * 2;
            int resto2 = soma2 % 11;
            int digito2 = resto2 < 2 ? 0 : 11 - resto2;

            return numeros[9] == digito1 && numeros[10] == digito2;
        }


    }

}
    