using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aisentona.DataBase
{
    public class YoutubeWidget
    {
        public YoutubeWidget()
        {
        }
        public YoutubeWidget(int id, string tipo, string youtubeId, string titulo, bool fl_Ativo)
        {
            Id = id;
            Tipo = tipo;
            YoutubeId = youtubeId;
            Titulo = titulo;
            Fl_Ativo = fl_Ativo;
        }

        public int Id { get; set; }
        public string Tipo { get; set; } // "video", "canal", "playlist"
        public string YoutubeId { get; set; }
        public string Titulo { get; set; }
        public bool Fl_Ativo { get; set; } = true;
    }

}
