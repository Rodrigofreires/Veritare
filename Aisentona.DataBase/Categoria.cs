using System.ComponentModel.DataAnnotations;

namespace Aisentona.DataBase
{
    public class Categoria
    {
        public Categoria()
        {
        }
        public Categoria(string nome, string? descricao)
        {
            Nome = nome;
            Descricao = descricao;

        }

        [Key]        
        public int Id_Categoria { get; set; }
        public  string Nome { get; set; }
        public string? Descricao { get; set; }

        ICollection<Postagem> Postagem { get; set; }

    }
}