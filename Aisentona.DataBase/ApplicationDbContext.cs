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
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ColaboradorEmail>()
                .HasOne(e => e.Colaborador)
                .WithOne(c => c.Emails)
                .HasForeignKey<ColaboradorEmail>(e => e.Id_Colaborador);

            modelBuilder.Entity<ColaboradorTelefone>()
                .HasOne(t => t.Colaborador)
                .WithOne(c => c.Telefones)
                .HasForeignKey<ColaboradorTelefone>(t => t.Id_Colaborador);

            modelBuilder.Entity<ColaboradorPermissao>()
                .HasOne(t => t.Colaborador)
                .WithOne(c => c.Permissoes)
                .HasForeignKey<ColaboradorPermissao>(t => t.Id_Colaborador);

            modelBuilder.Entity<ColaboradorTipoUsuario>()
               .HasOne(t => t.Colaborador)
               .WithOne(c => c.TipoUsuario)
               .HasForeignKey<ColaboradorTipoUsuario>(t => t.Id_Colaborador);

        }
    }
}
