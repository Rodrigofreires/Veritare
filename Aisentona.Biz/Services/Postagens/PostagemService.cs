using Aisentona.DataBase;
using Microsoft.EntityFrameworkCore;
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
            List<Postagem> listaDePostagens = _context.CF_Postagem.Where(c => c.Id_Usuario == id && c.Fl_Ativo).ToList();
           
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

        public Postagem EditarPostagem(int idpostagem, Postagem postagemDto)
        {
            Postagem postagem = _context.CF_Postagem.Find(idpostagem);
            
            if (postagem is null)
            {
                throw new KeyNotFoundException("Colaborador não encontrado");
            }

            postagem.Titulo = postagemDto.Titulo;
            postagem.Conteudo = postagemDto.Conteudo;
            postagem.Fl_Ativo = postagemDto.Fl_Ativo;
            postagem.Id_Categoria = postagemDto.Id_Categoria;
            postagem.Id_Status = postagemDto.Id_Status;
            postagem.DT_UltimaAlteracao = DateTime.Now;
            postagem.Ds_UltimaAlteracao = GetWindowsUsername();

            _context.CF_Postagem.Update(postagem);
            _context.SaveChanges();

            return postagem;
        }

        public Postagem TrocarFlagAtivaPostagem(int idPostagem)
        {
            Postagem postagem = _context.CF_Postagem.Find(idPostagem);
            if (postagem is null)
            {
                throw new KeyNotFoundException("Colaborador não encontrado");
            }

            postagem.Fl_Ativo = !postagem.Fl_Ativo;

            _context.CF_Postagem.Update(postagem);
            _context.SaveChanges();

            return postagem;
        }
    }
}
