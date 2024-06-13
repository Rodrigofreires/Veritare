using Microsoft.IdentityModel.Tokens;
using Aisentona.DataBase;
using Microsoft.EntityFrameworkCore;
using System.Security.Principal;
using System.Data.SqlTypes;

namespace Aisentona.Biz.Services
{
    public class ColaboradorEmailService
    {
        private readonly ApplicationDbContext _context;  
        public ColaboradorEmailService(ApplicationDbContext context)
        {
             _context = context;
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

        public ColaboradorEmail CriarEmailColaborador(int id_Email, string ds_Email, bool fl_Ativo, int id_Usuario)
        {
            ColaboradorEmail emailColaborador = new ColaboradorEmail()
            {
                Id_Email = id_Email,
                Ds_Email = ds_Email,
                Fl_Ativo = fl_Ativo,
                DT_Criacao = DateTime.UtcNow,
                Ds_UltimaAlteracao = GetWindowsUsername(),
                Id_Usuario = id_Usuario,
            };

            // Lógica para salvar o colaborador no banco de dados
            _context.CF_ColaboradorEmail.Add(emailColaborador);
            _context.SaveChanges();

            return emailColaborador;
        }

        public ColaboradorEmail EditarEmailColaborador(int id, ColaboradorEmail colaboradorEmailDto)
        {
            var colaboradorEmail = _context.CF_ColaboradorEmail.Find(id);
            if (colaboradorEmail is null)
            {
                throw new KeyNotFoundException("Colaborador Email não encontrado");
            }

            colaboradorEmail.Ds_Email = colaboradorEmailDto.Ds_Email;
            colaboradorEmail.Fl_Ativo = colaboradorEmailDto.Fl_Ativo;
            colaboradorEmail.DT_UltimaAlteracao = DateTime.Now;
            colaboradorEmail.Id_Usuario = colaboradorEmailDto.Id_Usuario;
            colaboradorEmail.Ds_UltimaAlteracao = GetWindowsUsername();

            // Verifica e ajusta as datas se necessário
            if (colaboradorEmail.DT_Criacao < (DateTime)SqlDateTime.MinValue)
            {
                colaboradorEmail.DT_Criacao = (DateTime)SqlDateTime.MinValue;
            }

            if (colaboradorEmail.DT_UltimaAlteracao < (DateTime)SqlDateTime.MinValue)
            {
                colaboradorEmail.DT_UltimaAlteracao = (DateTime)SqlDateTime.MinValue;
            }

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
