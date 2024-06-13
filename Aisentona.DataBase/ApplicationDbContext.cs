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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Colaborador>()
                .HasOne(c => c.Emails)
                .WithOne(e => e.Colaborador)
                .HasForeignKey<ColaboradorEmail>(e => e.Id_Colaborador);

            modelBuilder.Entity<Colaborador>()
                .HasOne(c => c.Telefones)
                .WithOne(t => t.Colaborador)
                .HasForeignKey<ColaboradorTelefone>(t => t.Id_Colaborador);

            modelBuilder.Entity<Colaborador>()
                .HasOne(c => c.TipoUsuario)
                .WithOne(t => t.Colaborador)
                .HasForeignKey<ColaboradorTipoUsuario>(t => t.Id_Colaborador);


        }
    }
}
