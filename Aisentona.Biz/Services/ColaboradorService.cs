
using Microsoft.IdentityModel.Tokens;
using Aisentona.DataBase;
using Microsoft.EntityFrameworkCore;

namespace Aisentona.Biz.Services
{
    public class ColaboradorService
    {
        private readonly ApplicationDbContext _context;  
        public ColaboradorService(ApplicationDbContext context)
        {
             _context = context;
        }

        public List<Colaborador>? GetColaboradorById(int id)
        {
            List<Colaborador>? listaDeColaboradores = new List<Colaborador>();
           

            listaDeColaboradores.Add(_context.CF_Colaborador      
                .FirstOrDefault(c => c.Id_Usuario == id));


            return listaDeColaboradores;
        }
    }
}
