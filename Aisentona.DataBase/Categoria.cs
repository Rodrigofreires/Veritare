using System.ComponentModel.DataAnnotations;

namespace Aisentona.DataBase
{
    public class Categoria
    {
        public Categoria()
        {
        }
        public Categoria(int id_Categoria, string nome, string? descricao)
        {
            Id_Categoria = id_Categoria;
            Nome = nome;
            Descricao = descricao;

        }

        [Key]        
        public int Id_Categoria { get; set; }
        public required string Nome { get; set; }
        public string? Descricao { get; set; }

    }
}