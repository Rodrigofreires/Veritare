using Aisentona.DataBase;
using Aisentona.Entities.Request;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aisentona.Biz.Validators
{
    public class TelefoneValidator : AbstractValidator<TelefoneRequest>
    {
        public TelefoneValidator()
        {
            RuleFor(x => x.NumeroContato) //Regras de Validação para o telefone
                .NotNull().WithMessage("Número de Telefone obrigatório")
                .MinimumLength(11).WithMessage("Número de Telefone ou Celular inválido. Verifique o DDD.")
                .Must(x => AceitarApenasNumeros(x)).WithMessage("Você NÃO pode colocar letras em um número de telefone.");

            RuleFor(x => x.Apelido) //Regras de Validação para o telefone
                .NotNull().WithMessage("Nome do Telefone obrigatório");

            RuleFor(x => x.UsuarioId) //Regras de Validação para o telefone
                .NotNull().WithMessage("Defina o número principal");

        }

        private bool AceitarApenasNumeros(string NumeroContato)
        {
            return NumeroContato.Any(x => Char.IsNumber(x));

            //Any quebra (pega) minha string caractere por caractere
            //Ele joga dentro da minha lâmbida
            //IsNumber verifica se há número dentro do meu caractere
        }
    }
}
