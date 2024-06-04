using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aisentona.DataBase
{
    public class ApplicationDbContext : DbContext 
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : base(options)
        {
        }

        public DbSet<Colaborador> Colaboradores { get; set; }
        public DbSet<ColaboradorEmail> ColaboradoresEmail { get; set; }
        public DbSet<ColaboradorTelefone> ColaboradoresTelefone { get; set; }
        public DbSet<ColaboradorPermissao> ColaboradoresPermissao { get; set; }
        public DbSet<ColaboradorTipoUsuario> ColaboradoresTipoUsuario { get; set; }
        public DbSet<Permissao> Permissoes { get; set; }


    }
}
