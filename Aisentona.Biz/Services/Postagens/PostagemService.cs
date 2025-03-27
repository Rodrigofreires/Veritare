using Aisentona.DataBase;
using Aisentona.Entities;
using Aisentona.Entities.Request;
using Aisentona.Entities.Response;
using Aisentona.Entities.ViewModels;
using Aisentona.Enumeradores;
using Microsoft.EntityFrameworkCore;
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

        public List<PostagemRequest> ListarUltimasPostagens()
        {
            // Busca as últimas 4 postagens ativas, ordenadas pela data de criação

            List<Postagem> ultimasPostagens = _context.CF_Postagem
                .Include(p => p.Categoria) // Inclui a relação com a Categoria
                .Include(p => p.Status)
                .Where(p => p.Fl_Ativo == true && p.Fl_Premium == false) // Filtra apenas as postagens ativas
                .OrderByDescending(p => p.DT_Criacao) // Ordena pela data de criação (mais recentes primeiro)
                .Take(4) // Limita a 4 postagens
                .ToList();

            // Mapeia as postagens para PostagemDTO
            return MapearParaDTO(ultimasPostagens);
        }

        public List<PostagemRequest> ListarUltimasPostagensPremium()
        {
            // Busca as últimas 4 postagens ativas, ordenadas pela data de criação

            List<Postagem> ultimasPostagens = _context.CF_Postagem
                .Include(p => p.Categoria) // Inclui a relação com a Categoria
                .Include(p => p.Status)
                .Where(p => p.Fl_Ativo == true && p.Fl_Premium == true) // Filtra apenas as postagens ativas e Premium
                .OrderByDescending(p => p.DT_Criacao) // Ordena pela data de criação (mais recentes primeiro)
                .Take(3) // Limita a 4 postagens
                .ToList();

            // Mapeia as postagens para PostagemDTO
            return MapearParaDTO(ultimasPostagens);
        }

        public List<PostagemRequest> ListarPostagens()
        {

            List<Postagem> postagens = _context.CF_Postagem
                .Include(p => p.Categoria) // Inclui a relação com a Categoria
                .Include(p => p.Status)
                .Where(p => p.Fl_Ativo == true) // Filtra apenas as postagens ativas
                .OrderByDescending(p => p.DT_Criacao) // Ordena pela data de criação (mais recentes primeiro)
                .ToList();

            // Mapeia as postagens para PostagemDTO
            return MapearParaDTO(postagens);
        }

        public List<PostagemRequest> ListarPostagensComFiltro(PostagemResponse postagemResponse)
        {
            // Usando AsNoTracking para consultas de leitura
            var query = _context.CF_Postagem
                .AsNoTracking()  // Não rastrear as entidades para melhorar a performance
                .Include(p => p.Categoria)
                .Include(p => p.Status)
                .OrderByDescending(p => p.DT_Criacao)
                .Where(p => p.Fl_Ativo == true);

            // Filtro por Título
            if (!string.IsNullOrEmpty(postagemResponse.Titulo))
            {
                query = query.Where(p => p.Titulo.Contains(postagemResponse.Titulo));
            }

            // Filtro por Status
            if (postagemResponse.IdStatus != 0)
            {
                query = query.Where(p => p.Status.Id_Status == postagemResponse.IdStatus);
            }

            // Filtro por Editoria
            if (postagemResponse.IdCategoria != 0)
            {
                query = query.Where(p => p.Id_Categoria == postagemResponse.IdCategoria);
            }

            // Filtro por Tipo de Publicação (Premium/Comum)
            if (postagemResponse.PremiumOuComum.Contains("Publicação Comum"))
            {
                query = query.Where(p => p.Fl_Premium == false);
            }

            if (postagemResponse.PremiumOuComum.Contains("Publicação Premium"))
            {
                query = query.Where(p => p.Fl_Premium == true);
            }


            // Filtro por Data de Publicação (Período)
            if (postagemResponse?.DataCriacao != null)
            {
                query = query.Where(p => p.DT_Criacao >= postagemResponse.DataCriacao);
            }

            // Ordena as postagens pela data de criação (mais recentes primeiro)
            query = query.OrderByDescending(p => p.DT_Criacao);

            // Mapeia as postagens para PostagemDTO
            var postagens = query.ToList();
            return MapearParaDTO(postagens);
        }

        public PostagemRequest CarregarPostagemPorId(int id)
        {
            Postagem? postagem = _context.CF_Postagem.FirstOrDefault(c => c.Id_Postagem == id && c.Fl_Ativo);

             List<EditoriaDTO> editoriaDTO = ListarEditorias();

            PostagemRequest postagemRequest = ConverterPostagemDTO(postagem);

            EditoriaDTO categoria = editoriaDTO.Where(c => c.Id == postagemRequest.IdCategoria).FirstOrDefault();

            postagemRequest.NomeCategoria = categoria?.Nome ?? "Categoria não encontrada";

            return postagemRequest;
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

        public Postagem CriarPostagem(PostagemResponse postagemResponse)
        {
            Postagem postagemConvertida = ConverterPostagem(postagemResponse);
            Postagem novaPostagem = postagemConvertida;

            novaPostagem.Fl_Ativo = true;
            novaPostagem.DT_Criacao = DateTime.Now;
            novaPostagem.Ds_UltimaAlteracao = GetWindowsUsername();
            novaPostagem.DT_UltimaAlteracao = null;
            novaPostagem.Id_Usuario = novaPostagem.Id_Usuario;
            novaPostagem.Fl_Premium = bool.Parse(postagemResponse.PremiumOuComum);

            _context.CF_Postagem.Add(novaPostagem);
            _context.SaveChanges();

            return novaPostagem;
        }
        public Postagem EditarPostagem(PostagemResponse postagemResponse)
        {
            Postagem postagem = _context.CF_Postagem.FirstOrDefault(x => x.Id_Postagem == postagemResponse.IdPostagem);
            
            if (postagem is not null) 
            {
                // Obtém o usuário do banco de dados pelo id_Usuario
                var usuario = _context.CF_Colaborador.FirstOrDefault(u => u.Id_Usuario == postagemResponse.IdUsuario);

                if (usuario == null)
                {
                    throw new ApplicationException("Usuário não encontrado.");
                }

                // Verifica o tipo de usuário e suas permissões
                Autorizacao tipoUsuario = (Autorizacao)usuario.Id_TipoUsuario;
                List<string> permissions = tipoUsuario.GetPermissions();

                // Verifica se o usuário tem permissão para criar postagens
                if (!permissions.Contains("EditarPostsSimples") && !permissions.Contains("EditarPostsPremium"))
                {
                    throw new UnauthorizedAccessException("Usuário não possui permissão para editar postagens.");
                }

                postagem.Titulo = postagemResponse.Titulo;
                postagem.Descricao = postagemResponse.Descricao;
                postagem.Conteudo = postagemResponse.Conteudo;
                postagem.Texto_alterado_por_ia = postagemResponse.TextoAlteradoPorIA;
                postagem.Palavras_retiradas_por_ia = postagemResponse.PalavrasRetiradasPorIA;
                postagem.Imagem_base64 = postagemResponse.Imagem;
                postagem.Id_Categoria = postagemResponse.IdCategoria;
                postagem.Id_Status = postagemResponse.IdStatus;
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


        public List<PostagemRequest> FiltrarPostagensPorEditoria(int IdCategoria)
        {
            List<Postagem> listaDePostagensFiltradas = _context.CF_Postagem
                .Include(p => p.Categoria) // Inclui a relação com a Categoria
                .Include(p => p.Status)
                .Where(p => p.Fl_Ativo == true && p.Id_Categoria == IdCategoria) // Filtra apenas as postagens ativas
                .OrderByDescending(p => p.DT_Criacao) // Ordena pela data de criação (mais recentes primeiro)
                .ToList();

            // Mapeia as postagens para PostagemDTO
            return MapearParaDTO(listaDePostagensFiltradas);

        }

        #region /*Métodos de conversão*/
        private Postagem ConverterPostagem(PostagemResponse postagemResponse)
        {

            Postagem potagemConvertida = new Postagem()
            {
                Id_Categoria = postagemResponse.IdCategoria,
                Id_Status = postagemResponse.IdStatus,
                Titulo = postagemResponse.Titulo,
                Conteudo = postagemResponse.Conteudo,
                Descricao = postagemResponse.Descricao,
                Id_Usuario = postagemResponse.IdUsuario,
                Imagem_base64 = postagemResponse.Imagem,
                Texto_alterado_por_ia = postagemResponse.TextoAlteradoPorIA,
                Palavras_retiradas_por_ia = postagemResponse.PalavrasRetiradasPorIA
            };

            return potagemConvertida;

        }

        private PostagemRequest ConverterPostagemDTO(Postagem? postagem)
        {
             PostagemRequest postagemDTO = new PostagemRequest()
            {
                IdCategoria = postagem.Id_Categoria,
                IdStatus = postagem.Id_Status,
                IdUsuario = postagem.Id_Usuario, 
                Titulo = postagem.Titulo,
                Conteudo = postagem.Conteudo,
                Descricao = postagem.Descricao,
                Imagem = postagem.Imagem_base64,
                TextoAlteradoPorIA = postagem.Texto_alterado_por_ia,
                PalavrasRetiradasPorIA = postagem.Palavras_retiradas_por_ia,
                DataCriacao = postagem.DT_Criacao
            };

            return postagemDTO;
        }

        private List<PostagemRequest> MapearParaDTO(List<Postagem> postagens)
        {
            return postagens.Select(postagem => new PostagemRequest
            {
                IdPostagem = postagem.Id_Postagem,
                IdCategoria = postagem.Id_Categoria,
                IdStatus = postagem.Id_Status,
                IdUsuario = postagem.Id_Usuario,
                Titulo = postagem.Titulo,
                Conteudo = postagem.Conteudo,
                Descricao = postagem.Descricao,
                Imagem = postagem.Imagem_base64,
                TextoAlteradoPorIA = postagem.Texto_alterado_por_ia,
                PalavrasRetiradasPorIA = postagem.Palavras_retiradas_por_ia,
                DataCriacao = postagem.DT_Criacao,
                NomeCategoria = postagem.Categoria?.Nome ?? "Categoria não encontrada",
                NomeStatus = postagem.Status?.Descricao ?? "Status não encontrado",
                PremiumOuComum = postagem.Fl_Premium
                
            }).ToList();
        }

        #endregion

    }
}
