using Aisentona.DataBase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace Aisentona.Biz.Services.Postagens
{
    public class PostagemService
    {
        private readonly ApplicationDbContext _context;

        public PostagemService(ApplicationDbContext postagemContext )
        {
            _context = postagemContext;
        }
        private string GetWindowsUsername() => WindowsIdentity.GetCurrent().Name;

        public List<Postagem> ListarPostagens(int id)
        {
            var postagem = _context.CF_Postagem.FirstOrDefault(c => c.Id_Usuario == id);

            List<Postagem> listaDePostagens = new List<Postagem>();

            if( postagem != null && postagem.Fl_Ativo == true)
            {
                listaDePostagens.Add(postagem);
            }
            return listaDePostagens;
        }

        public Postagem CriarPostagem(int id_Usuario, int idCategoria, int idStatus, string titulo, string conteudo)
        {
            Postagem novaPostagem = new Postagem()
            {
                Id_Usuario = id_Usuario,
                Id_Categoria = idCategoria,
                Id_Status = idStatus,
                Titulo = titulo,
                Conteudo = conteudo,
                Fl_Ativo = true,
                DT_UltimaAlteracao = null,
                Ds_UltimaAlteracao = GetWindowsUsername()
            };


            _context.CF_Postagem.Add(novaPostagem);
            _context.SaveChanges();

            return novaPostagem;
        }

    }
}
