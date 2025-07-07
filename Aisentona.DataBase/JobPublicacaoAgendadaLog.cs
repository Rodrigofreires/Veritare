using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aisentona.DataBase
{
    // Exemplo de classe para o log de publicação agendada
    public class JobPublicacaoAgendadaLog
    {
        public int Id { get; set; }
        public int IdPostagem { get; set; }
        public string TituloPostagem { get; set; }
        public DateTime DataExecucao { get; set; }
        public string Acao { get; set; }
        public DateTime? DataPublicacaoAgendadaOriginal { get; set; }
        public string Erro { get; set; } // Para registrar erros específicos
    }
}
