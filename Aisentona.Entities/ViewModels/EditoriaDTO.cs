﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aisentona.Entities.ViewModels
{
    public class EditoriaDTO
    {

        public EditoriaDTO()
        {
                
        }

        public EditoriaDTO(int id, string nome)
        {
            Id = id;
            Nome = nome;
        }

        public int Id { get; set; }
        public string Nome { get; set; }
    }
}
