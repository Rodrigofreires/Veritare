using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aisentona.DataBase
{
    public class JobExpiracaoPremiumLog
    {
        public int Id { get; set; }
        public int? IdUsuario { get; set; }
        public string NomeUsuario { get; set; }
        public DateTime DataExecucao { get; set; } = DateTime.UtcNow;
        public string Acao { get; set; }
        public string? Erro { get; set; }
        
    }
}
