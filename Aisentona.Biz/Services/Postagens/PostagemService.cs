using Aisentona.DataBase;
using Aisentona.Entities;
using Aisentona.Enum;
using System.Security.Principal;

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
            // Obtém o usuário do banco de dados pelo id_Usuario
            var usuario = _context.CF_Colaborador.FirstOrDefault(u => u.Id_Usuario == id_Usuario);

            if (usuario == null)
            {
                throw new ApplicationException("Usuário não encontrado.");
            }

            // Verifica o tipo de usuário e suas permissões
            Autorizacao tipoUsuario = (Autorizacao)usuario.Id_TipoUsuario;
            var permissions = tipoUsuario.GetPermissions();

            // Verifica se o usuário tem permissão para criar postagens
            if (!permissions.Contains("CadastrarPostsSimples") && !permissions.Contains("CadastrarPostsPremium"))
            {
                throw new UnauthorizedAccessException("Usuário não possui permissão para criar postagens.");
            }


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

        public Postagem EditarPostagem(int id_Usuario, int idpostagem, Postagem postagemDto)
        {
            Postagem postagem = _context.CF_Postagem.Find(idpostagem);
            
            if (postagem is null)
            {
                throw new KeyNotFoundException("Colaborador não encontrado");
            }

            // Obtém o usuário do banco de dados pelo id_Usuario
            var usuario = _context.CF_Colaborador.FirstOrDefault(u => u.Id_Usuario == id_Usuario);

            if (usuario == null)
            {
                throw new ApplicationException("Usuário não encontrado.");
            }

            // Verifica o tipo de usuário e suas permissões
            Autorizacao tipoUsuario = (Autorizacao)usuario.Id_TipoUsuario;
            var permissions = tipoUsuario.GetPermissions();

            // Verifica se o usuário tem permissão para criar postagens
            if (!permissions.Contains("EditarPostsSimples") && !permissions.Contains("EditarPostsPremium"))
            {
                throw new UnauthorizedAccessException("Usuário não possui permissão para editar postagens.");
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
