﻿using Aisentona.DataBase;
using Aisentona.DataBase.YourNamespace;
using Microsoft.EntityFrameworkCore;

namespace Aisentona.DataBase
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Colaborador> CF_Colaborador { get; set; }
        public DbSet<ColaboradorTelefone> CF_ColaboradorTelefone { get; set; }
        public DbSet<ColaboradorPermissao> CF_ColaboradorPermissao { get; set; }
        public DbSet<ColaboradorTipoUsuario> CF_ColaboradorTipoUsuario { get; set; }
        public DbSet<Postagem> CF_Postagem { get; set; }
        public DbSet<Categoria> CF_Postagem_Categoria { get; set; }
        public DbSet<AcessoUsuario> CF_AcessoUsuario { get; set; }
        public DbSet<Status> CF_Postagem_Status { get; set; }
        public DbSet<Tags> CF_Postagem_Tags { get; set; }
        public DbSet<TipoPlano> CF_TipoPlano { get; set; }

        public DbSet<JobExpiracaoPremiumLog> Job_ExpiracaoPremium_Log { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                var properties = entityType.ClrType.GetProperties()
                    .Where(p => p.PropertyType == typeof(DateTime) || p.PropertyType == typeof(DateTime?));
                foreach (var property in properties)
                {
                    modelBuilder.Entity(entityType.Name)
                        .Property(property.Name)
                        .HasColumnType("datetime2");
                }
            }

            // Relacionamento de 1 para 1 entre Colaborador e AcessoUsuario
            modelBuilder.Entity<Colaborador>()
                .HasOne(c => c.AcessoUsuario)
                .WithOne()
                .HasForeignKey<AcessoUsuario>(a => a.Id_Usuario);

            // Relacionamento de 1 para 1 entre Colaborador e ColaboradorTelefone
            modelBuilder.Entity<Colaborador>()
                .HasOne(c => c.Telefones)
                .WithOne()  // Relacionamento de 1 para 1
                .HasForeignKey<ColaboradorTelefone>(a => a.Id_Usuario);

            modelBuilder.Entity<Colaborador>()
                .HasOne(c => c.TipoUsuario)
                .WithOne()  // Relacionamento de 1 para 1
                .HasForeignKey<ColaboradorTipoUsuario>(a => a.Id_TipoUsuario);

            // Relacionamento de 1 para N entre AcessoUsuario e TipoPlano
            modelBuilder.Entity<AcessoUsuario>()
                .HasOne(a => a.TipoPlano)  // Um AcessoUsuario tem um TipoPlano
                .WithMany()  // TipoPlano pode ter vários AcessoUsuario
                .HasForeignKey(a => a.Id_Plano)  // Relacionamento através da FK
                .OnDelete(DeleteBehavior.SetNull);  // Caso o TipoPlano seja deletado, o AcessoUsuario mantém a referência como nula
        }
    }
}
