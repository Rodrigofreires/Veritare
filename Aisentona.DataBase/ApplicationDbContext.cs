using Microsoft.EntityFrameworkCore;

namespace Aisentona.DataBase
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Colaborador> CF_Colaborador { get; set; }
        public DbSet<ColaboradorEmail> CF_ColaboradorEmail { get; set; }
        public DbSet<ColaboradorTelefone> CF_ColaboradorTelefone { get; set; }
        public DbSet<ColaboradorPermissao> CF_ColaboradorPermissao { get; set; }
        public DbSet<ColaboradorTipoUsuario> CF_ColaboradorTipoUsuario { get; set; }

 
    }
}
