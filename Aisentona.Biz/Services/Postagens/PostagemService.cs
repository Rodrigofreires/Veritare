using Aisentona.DataBase;
using Aisentona.Entities;
using Aisentona.Entities.ViewModels;
using Aisentona.Enum;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Net.NetworkInformation;
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

        public List<Postagem> ListarPostagens()
        {
            List<Postagem> listaDePostagens = new();

            listaDePostagens = _context.CF_Postagem.Where(c => c.Fl_Ativo == true).ToList();
           
            return listaDePostagens;
        }

        public Postagem CarregarPostagem(int id)
        {
            Postagem? postagem = _context.CF_Postagem.FirstOrDefault(c => c.Id_Postagem == id && c.Fl_Ativo);

            return postagem;
        }


        public List<EditoriaDTO> ListarEditorias()
        {
            List<Categoria> listaDeEditoriasDB = _context.CF_Postagem_Categoria
                .Where(c => c.Id_Categoria != null)
                .ToList();

            List<EditoriaDTO> listaEditorias = listaDeEditoriasDB
                .Select(c => new EditoriaDTO
                {
                    Id = c.Id_Categoria, 
                    Nome = c.Nome 
                })
                .ToList();

            return listaEditorias; 
        }

        public List<StatusDTO> ListarStatus()
        {
            List<Status> listaStatusDB = _context.CF_Postagem_Status
                .Where(c => c.Id_Status != null)
                .ToList();

            List<StatusDTO> listaStatus = listaStatusDB
                .Select(c => new StatusDTO
                {
                    Id = c.Id_Status,
                    Descricao = c.Descricao
                })
                .ToList();

            return listaStatus;

        }

        public Postagem CriarPostagem(PostagemDTO postagemDTO)
        {
            Postagem postagemConvertida = ConverterPostagem(postagemDTO);
            Postagem novaPostagem = postagemConvertida;


            novaPostagem.Fl_Ativo = true;
            novaPostagem.DT_Criacao = DateTime.Now;
            novaPostagem.Ds_UltimaAlteracao = GetWindowsUsername();
            novaPostagem.DT_UltimaAlteracao = null;
            novaPostagem.Id_Usuario = novaPostagem.Id_Usuario;

            _context.CF_Postagem.Add(novaPostagem);
            _context.SaveChanges();

            return novaPostagem;
        }
        public Postagem EditarPostagem(PostagemDTO postagemDTO)
        {
            Postagem postagem = _context.CF_Postagem.FirstOrDefault(x => x.Id_Postagem == postagemDTO.IdPostagem);
            
            if (postagem is not null) 
            {
                // Obtém o usuário do banco de dados pelo id_Usuario
                var usuario = _context.CF_Colaborador.FirstOrDefault(u => u.Id_Usuario == postagemDTO.IdUsuario);

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

                postagem.Titulo = postagemDTO.Titulo;
                postagem.Conteudo = postagemDTO.Conteudo;
                postagem.Id_Categoria = postagemDTO.IdCategoria;
                postagem.Id_Status = postagemDTO.IdStatus;
                postagem.DT_UltimaAlteracao = DateTime.Now;
                postagem.Ds_UltimaAlteracao = GetWindowsUsername();

                _context.CF_Postagem.Update(postagem);
                _context.SaveChanges();
                return postagem;
            }
;
            throw new UnauthorizedAccessException("Postagem não encontrada");

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

        private Postagem ConverterPostagem(PostagemDTO postagemDTO)
        {

            Postagem potagemConvertida = new Postagem()
            {
                Id_Categoria = postagemDTO.IdCategoria,
                Id_Status = postagemDTO.IdStatus,
                Titulo = postagemDTO.Titulo,
                Conteudo = postagemDTO.Conteudo,
                Descricao = postagemDTO.Descricao,
                Id_Usuario = postagemDTO.IdUsuario,
                Imagem_base64 = postagemDTO.Imagem,
                Texto_alterado_por_ia = postagemDTO.TextoAlteradoPorIA,
                Palavras_retiradas_por_ia = postagemDTO.PalavrasRetiradasPorIA
            };

            return potagemConvertida;

        }

    }
}
