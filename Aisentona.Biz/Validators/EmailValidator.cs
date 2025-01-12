using Aisentona.Entities.Request;
using FluentValidation;
using FluentValidation.Validators;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aisentona.Biz.Validators
{
    public class EmailValidator : AbstractValidator<EmailRequest>
    {
        public EmailValidator()
        {
            RuleFor(x => x.Email) //Regras de Validação para Email
                .NotNull().WithMessage("O E-mail é obrigatório")
                .EmailAddress().WithMessage("Endereço de E-mail inválido")
                .Matches("^[^<>]*$").WithMessage("O e-mail não pode conter os caracteres '<' ou '>'.")
                .MaximumLength(254).WithMessage("O e-mail não pode ter mais de 254 caracteres.")
                .Must(email => !email.EndsWith("@tempmail.com")).WithMessage("E-mails temporários não são permitidos.");



            RuleFor(x => x.UsuarioId)
                .NotNull().WithMessage("Defina o E-mail principal");


        }
    }
}
