using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aisentona.DataBase
{
    public class Status
    {
        public Status()
        {
        }

        public Status(int id_Status, string descricao)
        {
            Id_Status = id_Status;
            Descricao = descricao;
        }

        [Key]
        public int Id_Status { get; set; }
        public required string Descricao { get; set; }
    }
}
