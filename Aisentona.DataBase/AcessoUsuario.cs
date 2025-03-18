using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aisentona.DataBase
{
    using Microsoft.EntityFrameworkCore;
    using System;
    using System.ComponentModel.DataAnnotations;

    namespace Aisentona.DataBase
    {
        public class AcessoUsuario
        {
            public AcessoUsuario()
            {
                
            }
            public AcessoUsuario(int idAcessoUsuario, int idUsuario, DateTime? dtInicioAcesso, DateTime? dtFimAcesso, bool acessoPremium, DateTime? dtExpiracaoPremium)
            {
                Id_AcessoUsuario = idAcessoUsuario;
                Id_Usuario = idUsuario;
                Dt_InicioAcesso = dtInicioAcesso;
                Dt_FimAcesso = dtFimAcesso;
                AcessoPremium = acessoPremium;
                Dt_ExpiracaoPremium = dtExpiracaoPremium;

            }

            [Key]
            public int Id_AcessoUsuario { get; set; } 
            public int Id_Usuario { get; set; } 
            public DateTime? Dt_InicioAcesso { get; set; }
            public DateTime? Dt_FimAcesso { get; set; } 
            public bool AcessoPremium { get; set; } 
            public DateTime? Dt_ExpiracaoPremium { get; set; } 

        }
    }

}
