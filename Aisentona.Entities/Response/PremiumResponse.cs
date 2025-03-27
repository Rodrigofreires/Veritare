using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aisentona.Entities.Response
{
    public class PremiumResponse
    {
        public PremiumResponse()
        {
        }

        public PremiumResponse(int idUsuario, int idTipoPlanoPremium)
        {
            IdUsuario = idUsuario;
            IdTipoPlanoPremium = idTipoPlanoPremium;

        }

        public int IdUsuario { get; set; }
        public int IdTipoPlanoPremium { get; set; }
    }

}
