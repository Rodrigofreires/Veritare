using Aisentona.DataBase.YourNamespace;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Aisentona.DataBase
{
    public class AcessoUsuario
    {
        public AcessoUsuario()
        {
        }

        public AcessoUsuario(int idAcessoUsuario, int idUsuario, DateTime? dtInicioAcesso, DateTime? dtFimAcesso, bool flAcessoPremium, int? idPlano)
        {
            Id_AcessoUsuario = idAcessoUsuario;
            Id_Usuario = idUsuario;
            Dt_InicioAcesso = dtInicioAcesso;
            Dt_FimAcesso = dtFimAcesso;
            Fl_AcessoPremium = flAcessoPremium;
            Id_Plano = idPlano;
        }

        [Key]
        public int Id_AcessoUsuario { get; set; }

        public int Id_Usuario { get; set; }

        public DateTime? Dt_InicioAcesso { get; set; }

        public DateTime? Dt_FimAcesso { get; set; }

        public bool Fl_AcessoPremium { get; set; }

        // Adiciona a FK para TipoPlano
        [ForeignKey("TipoPlano")]
        public int? Id_Plano { get; set; }  // A FK pode ser nula, dependendo de como o relacionamento será gerido

        // Propriedade de navegação para a entidade TipoPlano (opcional)
        public TipoPlano TipoPlano { get; set; }
    }
}
