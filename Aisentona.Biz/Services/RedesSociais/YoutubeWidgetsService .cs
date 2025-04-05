using Aisentona.DataBase;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aisentona.Biz.Services.RedesSociais
{
    public class YoutubeWidgetsService
    {
       
        private readonly ApplicationDbContext _context;


        //Construtor
        public YoutubeWidgetsService(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<YoutubeWidget> GetAll()
        {
            return _context.CF_YoutubeWidget
                .Where(w => w.Fl_Ativo)
                .ToList();
        }

        public YoutubeWidget Create(YoutubeWidget widget)
        {


            _context.CF_YoutubeWidget.Add(widget);
            _context.SaveChanges();
            return widget;
        }

        public YoutubeWidget? Update(int id, YoutubeWidget updated)
        {
            var widget = _context.CF_YoutubeWidget.Find(id);
            if (widget == null) return null;

            widget.Titulo = updated.Titulo;
            widget.Tipo = updated.Tipo;
            widget.YoutubeId = updated.YoutubeId;

            _context.SaveChanges();
            return widget;
        }

        public bool Delete(int id)
        {
            var widget = _context.CF_YoutubeWidget.Find(id);
            if (widget == null || !widget.Fl_Ativo) return false;

            widget.Fl_Ativo = false;
            _context.SaveChanges();
            return true;
        }
        public async Task<List<YoutubeWidget>> GetByTipoAsync(string tipo)
        {
            return await _context.CF_YoutubeWidget
                .Where(w => w.Tipo.ToLower() == tipo.ToLower() && w.Fl_Ativo == true)
                .ToListAsync();
        }
    }
}
        

