using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Aisentona.Entities { 

    [Table("CF_HistoricoEnvioPrompt")] // Mapeia a classe para a tabela 'CF_HistoricoEnvioPrompt' no banco de dados.
    public class HistoricoEnvioPrompt
    {

        [Key] 
        public int Id { get; set; }

        [Required] 
        [MaxLength(255)]
        public required string Ds_Email { get; set; }

        [Required]
        [MaxLength(255)]
        public required string Nm_Pessoa { get; set; }

        [Required]
        public DateTime Dt_Envio { get; set; }
    }
}