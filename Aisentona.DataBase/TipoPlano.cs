using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aisentona.DataBase
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    namespace YourNamespace
    {
        [Table("CF_TipoPlano")]  // Mapeia a classe para a tabela CF_TipoPlano no banco de dados
        public class TipoPlano
        {
            [Key]
            [Column("Id_Plano")]
            public int IdPlano { get; set; }  // Identificador único do plano

            [Required]
            [Column("Nm_Plano")]
            [StringLength(100)]
            public string NomePlano { get; set; }  // Nome do plano (ex: "Mensal", "Semestral", "Anual")

            [Column("Ds_Plano")]
            public string? DescricaoPlano { get; set; }  // Descrição do plano (opcional)

            [Column("Duracao_Meses")]
            public int DuracaoMeses { get; set; }  // Duração do plano em meses (1 para mensal, 6 para semestral, 12 para anual)

            [Required]
            [Column("Valor_Plano")]
            [Range(0.01, double.MaxValue, ErrorMessage = "O valor do plano deve ser maior que zero.")]
            public decimal ValorPlano { get; set; }  // Valor do plano (por exemplo, 9.99, 49.95, 99.99)

            [Column("Fl_PlanoAtivo")]
            public bool PlanoAtivo { get; set; }  // Flag que indica se o plano está ativo (1 = Ativo, 0 = Inativo)

            [Column("Dt_Criacao")]
            public DateTime DataCriacao { get; set; }  // Data de criação do plano

            [Column("Dt_UltimaAtualizacao")]
            public DateTime? DataUltimaAtualizacao { get; set; }  // Data de atualização do plano

            // Construtores, se necessário
            public TipoPlano()
            {
                DataCriacao = DateTime.Now;
            }

            public TipoPlano(string nomePlano, string descricaoPlano, int duracaoMeses, decimal valorPlano, bool planoAtivo)
            {
                NomePlano = nomePlano;
                DescricaoPlano = descricaoPlano;
                DuracaoMeses = duracaoMeses;
                ValorPlano = valorPlano;
                PlanoAtivo = planoAtivo;
                DataCriacao = DateTime.Now;
            }
        }
    }

}
