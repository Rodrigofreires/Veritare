using System.ComponentModel.DataAnnotations;

namespace Aisentona.DataBase
{
    public class Tags
    {
        public Tags()
        {
        }

        public Tags(int id_Tag, string nome)
        {
            Id_Tag = id_Tag;
            Nome = nome;
            
        }

        [Key]
        public int Id_Tag { get; set; }
        public required string Nome { get; set; }
    }
}