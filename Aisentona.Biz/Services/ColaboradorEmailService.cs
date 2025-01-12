using Microsoft.IdentityModel.Tokens;
using Aisentona.DataBase;
using Microsoft.EntityFrameworkCore;
using System.Security.Principal;
using System.Data.SqlTypes;
using Aisentona.Entities.Request;
using FluentValidation.Results;
using Aisentona.Biz.Validators;
using FluentValidation;

namespace Aisentona.Biz.Services
{
    public class ColaboradorEmailService
    {
        private readonly ApplicationDbContext _context;
        private readonly EmailValidator _validator;
        public ColaboradorEmailService(ApplicationDbContext context, EmailValidator validator)
        {
             _context = context;
            _validator = validator;
        }

        private string GetWindowsUsername() => WindowsIdentity.GetCurrent().Name;

        public List<ColaboradorEmail>? ListarEmailColaboradorPorId(int id)
        {
            var colaboradorEmail = _context.CF_ColaboradorEmail.FirstOrDefault(c => c.Id_Email == id);
            List<ColaboradorEmail> listaDeEmailColaboradores = new List<ColaboradorEmail>();

            if (colaboradorEmail != null && colaboradorEmail.Fl_Ativo == true)
            {
                listaDeEmailColaboradores.Add(colaboradorEmail);
            }
            return listaDeEmailColaboradores;

        }

        public ColaboradorEmail CriarEmailColaborador(EmailRequest emailRequest)
        {
            //Chamando as Validações do Colaborador
            ValidationResult validadores = _validator.Validate(emailRequest);

            ColaboradorEmail emailColaborador = new();

            if (validadores.IsValid)
            {
                emailColaborador.Ds_Email = emailRequest.Descricao;
                emailColaborador.Ds_Descricao = emailRequest.Descricao;
                emailColaborador.Fl_Ativo = true;
                emailColaborador.DT_Criacao = DateTime.UtcNow;
                emailColaborador.Ds_UltimaAlteracao = GetWindowsUsername();
                emailColaborador.Id_Usuario = emailRequest.UsuarioId;

                //Verificando se já existe um e-mail desses cadastrado no banco 
                var emailExiste = _context.CF_ColaboradorEmail.Any(e => e.Ds_Email == emailRequest.Email);
                if (emailExiste) throw new Exception("E-mail já está em uso.");

                _context.CF_ColaboradorEmail.Add(emailColaborador);
                _context.SaveChanges();
               
            }
            return emailColaborador;
        }

        public ColaboradorEmail EditarEmailColaborador(EmailRequest emailRequest)
        {
            var colaboradorEmail = _context.CF_ColaboradorEmail.Find(emailRequest.UsuarioId);
            if (colaboradorEmail is null)
            {
                throw new KeyNotFoundException("Colaborador Email não encontrado");
            }

            colaboradorEmail.Ds_Email = emailRequest.Email;
            colaboradorEmail.Ds_Email = emailRequest.Descricao;
            

            if (colaboradorEmail.DT_UltimaAlteracao < (DateTime)SqlDateTime.MinValue)
            {
                colaboradorEmail.DT_UltimaAlteracao = (DateTime)SqlDateTime.MinValue;
            }

            colaboradorEmail.DT_UltimaAlteracao = DateTime.UtcNow;

            _context.CF_ColaboradorEmail.Update(colaboradorEmail);
            _context.SaveChanges();

            return colaboradorEmail;
        }

        public ColaboradorEmail TrocarFlagAtivaEmailColaborador(int id)
        {

            var colaboradorEmail = _context.CF_ColaboradorEmail.Find(id);
            if (colaboradorEmail is null)
            {
                throw new KeyNotFoundException("Email Colaborador não encontrado");
            }

            colaboradorEmail.Fl_Ativo = !colaboradorEmail.Fl_Ativo;

            _context.CF_ColaboradorEmail.Update(colaboradorEmail);
            _context.SaveChanges();

            return colaboradorEmail;
        }



    }
}
