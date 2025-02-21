using Aisentona.DataBase;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data.SqlTypes;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace Aisentona.Biz.Services
{
    
    public class ColaboradorTipoUsuarioService
    {
        private readonly ApplicationDbContext _context;
        public ColaboradorTipoUsuarioService(ApplicationDbContext context)
        {
            _context = context;
        }
        private string GetWindowsUsername() => WindowsIdentity.GetCurrent().Name;

        public List<ColaboradorTipoUsuario>? ListarColaboradorTipoUsuarioPorId()
        {
            var colaboradorTipoUsuario = _context.CF_ColaboradorTipoUsuario;
            List<ColaboradorTipoUsuario> listaDeColaboradoresTipoUsuario = new List<ColaboradorTipoUsuario>();

            listaDeColaboradoresTipoUsuario = colaboradorTipoUsuario.Where(x => x.Fl_Ativo == true).ToList();
            
            return listaDeColaboradoresTipoUsuario;

        }
        public ColaboradorTipoUsuario CriarColaboradorTipoUsuario(string nomeTipoUsuario, int id_TipoUsuario)
        {
            ColaboradorTipoUsuario colaboradorTipoUsuario = new ColaboradorTipoUsuario()
            {
                Nm_TipoUsuario = nomeTipoUsuario,
                Id_TipoUsuario = id_TipoUsuario,
                Fl_Ativo = true,
                DT_Criacao = DateTime.UtcNow,
            };

            // Lógica para salvar o colaborador no banco de dados
            _context.CF_ColaboradorTipoUsuario.Add(colaboradorTipoUsuario);
            _context.SaveChanges();

            return colaboradorTipoUsuario;
        }

        public ColaboradorTipoUsuario EditarColaboradorTipoUsuario(int id, ColaboradorTipoUsuario colaboradorTipoUsuarioDto)
        {
            var colaboradorTipoUsuario = _context.CF_ColaboradorTipoUsuario.Find(id);
            if (colaboradorTipoUsuario is null)
            {
                throw new KeyNotFoundException("Colaborador não encontrado");
            }

            colaboradorTipoUsuario.Nm_TipoUsuario = colaboradorTipoUsuarioDto.Nm_TipoUsuario;
            colaboradorTipoUsuario.Fl_Ativo = colaboradorTipoUsuarioDto.Fl_Ativo;
            colaboradorTipoUsuario.DT_UltimaAlteracao = DateTime.Now;
            colaboradorTipoUsuario.Id_TipoUsuario = colaboradorTipoUsuarioDto.Id_TipoUsuario;

            // Verifica e ajusta as datas se necessário
            if (colaboradorTipoUsuario.DT_Criacao < (DateTime)SqlDateTime.MinValue)
            {
                colaboradorTipoUsuario.DT_Criacao = (DateTime)SqlDateTime.MinValue;
            }

            if (colaboradorTipoUsuario.DT_UltimaAlteracao < (DateTime)SqlDateTime.MinValue)
            {
                colaboradorTipoUsuario.DT_UltimaAlteracao = (DateTime)SqlDateTime.MinValue;
            }

            _context.CF_ColaboradorTipoUsuario.Update(colaboradorTipoUsuario);
            _context.SaveChanges();

            return colaboradorTipoUsuario;
        }
        public ColaboradorTipoUsuario TrocarFlagAtivaColaborador(int id)
        {
            var colaboradorTipoUsuario = _context.CF_ColaboradorTipoUsuario.Find(id);
            if (colaboradorTipoUsuario is null)
            {
                throw new KeyNotFoundException("Colaborador não encontrado");
            }

            colaboradorTipoUsuario.Fl_Ativo = !colaboradorTipoUsuario.Fl_Ativo;

            _context.CF_ColaboradorTipoUsuario.Update(colaboradorTipoUsuario);
            _context.SaveChanges();

            return colaboradorTipoUsuario;
        }

    }


}
