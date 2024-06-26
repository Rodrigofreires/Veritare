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

        public DbSet<Categoria> CF_Categoria { get; set; }
        public DbSet<Postagem> CF_CPostagem { get; set; }
        public DbSet<Status> CF_Status { get; set; }
        public DbSet<Tags> CF_Tags { get; set; }

    }
}
