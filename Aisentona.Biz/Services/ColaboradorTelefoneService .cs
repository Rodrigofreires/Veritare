using Microsoft.IdentityModel.Tokens;
using Aisentona.DataBase;
using Microsoft.EntityFrameworkCore;
using System.Security.Principal;
using System.Data.SqlTypes;

namespace Aisentona.Biz.Services
{
    public class ColaboradorTelefoneService
    {
        private readonly ApplicationDbContext _context;  
        public ColaboradorTelefoneService(ApplicationDbContext telefoneContext)
        {
             _context = telefoneContext;
        }

        private string GetWindowsUsername() => WindowsIdentity.GetCurrent().Name;

        public List<ColaboradorTelefone>? ListarTelefoneColaboradorPorId(int id)
        {
            var colaboradorTelefone = _context.CF_ColaboradorTelefone.FirstOrDefault(c => c.Id_Telefone == id);
            List<ColaboradorTelefone> listaDeTelefoneColaboradores = new List<ColaboradorTelefone>();

            if (colaboradorTelefone != null && colaboradorTelefone.Fl_Ativo == true)
            {
                listaDeTelefoneColaboradores.Add(colaboradorTelefone);
            }
            return listaDeTelefoneColaboradores;

        }

        public ColaboradorTelefone CriarTelefoneColaborador(int id_Telefone, string nm_Apelido, string ds_Numero, bool fl_Ativo, int id_Usuario)
        {
            ColaboradorTelefone telefoneColaborador = new ColaboradorTelefone()
            {
                Id_Telefone = id_Telefone,
                Nm_Apelido = nm_Apelido,
                Ds_Numero = ds_Numero,
                Fl_Ativo = fl_Ativo,
                DT_Criacao = DateTime.UtcNow,
                Ds_UltimaAlteracao = GetWindowsUsername(),
                Id_Usuario = id_Usuario,
            };
            // Lógica para salvar o colaborador no banco de dados
            _context.CF_ColaboradorTelefone.Add(telefoneColaborador);
            _context.SaveChanges();

            return telefoneColaborador;

        }

        public ColaboradorTelefone EditarTelefoneColaborador(int id, ColaboradorTelefone colaboradorTelefoneDto)
        {
            var colaboradorTelefone = _context.CF_ColaboradorTelefone.Find(id);
            if (colaboradorTelefone is null)
            {
                throw new KeyNotFoundException("Colaborador Telefone não encontrado");
            }

            colaboradorTelefone.Nm_Apelido = colaboradorTelefoneDto.Nm_Apelido;
            colaboradorTelefone.Ds_Numero = colaboradorTelefoneDto.Ds_Numero;
            colaboradorTelefone.Fl_Ativo = colaboradorTelefoneDto.Fl_Ativo;
            colaboradorTelefone.DT_UltimaAlteracao = DateTime.Now;
            colaboradorTelefone.Id_Usuario = colaboradorTelefoneDto.Id_Usuario;
            colaboradorTelefone.Ds_UltimaAlteracao = GetWindowsUsername();

            // Verifica e ajusta as datas se necessário
            if (colaboradorTelefone.DT_Criacao < (DateTime)SqlDateTime.MinValue)
            {
                colaboradorTelefone.DT_Criacao = (DateTime)SqlDateTime.MinValue;
            }

            if (colaboradorTelefone.DT_UltimaAlteracao < (DateTime)SqlDateTime.MinValue)
            {
                colaboradorTelefone.DT_UltimaAlteracao = (DateTime)SqlDateTime.MinValue;
            }

            _context.CF_ColaboradorTelefone.Update(colaboradorTelefone);
            _context.SaveChanges();

            return colaboradorTelefone;
        }

        public ColaboradorTelefone TrocarFlagAtivaTelefoneColaborador(int id)
        {

            var colaboradorTelefone = _context.CF_ColaboradorTelefone.Find(id);
            if (colaboradorTelefone is null)
            {
                throw new KeyNotFoundException("Telefone Colaborador não encontrado");
            }

            colaboradorTelefone.Fl_Ativo = !colaboradorTelefone.Fl_Ativo;

            _context.CF_ColaboradorTelefone.Update(colaboradorTelefone);
            _context.SaveChanges();

            return colaboradorTelefone;
        }

        public object CriarTelefoneColaborador(int id_Telefone, string? nm_Apelido, string? ds_Numero, bool fl_Ativo, DateTime? dT_Criacao, int id_Usuario)
        {
            throw new NotImplementedException();
        }
    }
}
