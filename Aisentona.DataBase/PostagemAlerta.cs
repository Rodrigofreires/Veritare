using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Aisentona.DataBase
{
    public class PostagemAlerta
    {

        public PostagemAlerta()
        {
        }
        public PostagemAlerta(int idAlerta, int idPostagem, int numeroAlerta, string mensagem, Postagem postagem)
        {
            Id_Alerta = idAlerta;
            Id_Postagem = idPostagem;
            Numero_Alerta = numeroAlerta;
            Mensagem = mensagem;
            Postagem = postagem;
        }

        [Key]
        public int Id_Alerta { get; set; }

        [ForeignKey("Postagem")]
        public int Id_Postagem { get; set; }
        public int Numero_Alerta { get; set; } // Define a ordem do alerta na postagem
        public string Mensagem { get; set; } = string.Empty;

        public virtual Postagem Postagem { get; set; } // Relacionamento com a Postagem
    }
}
