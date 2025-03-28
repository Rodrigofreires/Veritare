using Aisentona.Biz.Services;
using Aisentona.Biz.Services.Postagens;
using Aisentona.DataBase;
using Aisentona.Entities;
using Aisentona.Entities.Request;
using Aisentona.Entities.Response;
using Aisentona.Entities.ViewModels;
using Aisentona.Enumeradores;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;


namespace Aisentona.API.Controllers.Postagens
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostagemController : ControllerBase
    {
        private readonly PostagemService _postagemService;
        private readonly ApplicationDbContext _context;
        private readonly AuthService _authService;


        public PostagemController(PostagemService postagemService, ApplicationDbContext context, AuthService authService)
        {
            _postagemService = postagemService;
            _context = context;
            _authService = authService;
        }

        [HttpGet("{id}")]
        public IActionResult GetNoticiaById(int id)
        {
            if (id <= 0)
            {
                return BadRequest("ID inválido.");
            }

            PostagemRequest postagemRequest = _postagemService.CarregarPostagemPorId(id);
            if (postagemRequest == null)
            {
                return NotFound();
            }
            return Ok(postagemRequest);
        }

        [HttpGet("listar-postagens-paginadas")]
        public IActionResult CarregarListaDePostagens(int pagina = 1, int quantidadePorPagina = 10)
        {
            var listaDePostagens = _postagemService.ListarPostagensPaginadas(pagina, quantidadePorPagina);
            if (listaDePostagens == null || !listaDePostagens.Any())
            {
                return NotFound();
            }
            return Ok(listaDePostagens);
        }




        [HttpPost("listar-postagens/filtros")]
        public IActionResult CarregarTodasAsPostagensPorFiltro([FromBody] PostagemResponse filtro)
        {
            if (filtro == null)
            {
                return BadRequest("Filtros não fornecidos.");
            }

            var listaDePostagens = _postagemService.ListarPostagensComFiltro(filtro);
            if (listaDePostagens == null)
            {
                return NotFound();
            }

            return Ok(listaDePostagens);
        }


        [HttpGet("listar-ultimas-postagens")]
        public IActionResult ListarUltimasPostagens()
        {
            List<PostagemRequest> listaDePostagens = _postagemService.ListarUltimasPostagens();
            if (listaDePostagens == null)
            {
                return NotFound();
            }
            return Ok(listaDePostagens);
        }

        [HttpGet("listar-ultimas-postagens-premium")]
        public IActionResult ListarUltimasPostagensPremium()
        {
            List<PostagemRequest> listaDePostagens = _postagemService.ListarUltimasPostagensPremium();
            if (listaDePostagens == null)
            {
                return NotFound();
            }
            return Ok(listaDePostagens);
        }


        [HttpGet("listar-por-editoria/{idEditoria}")]
        public IActionResult FiltrarPostagensPorEditoria(int idEditoria)
        {
            List<PostagemRequest> listaDePostagensFiltradas = _postagemService.FiltrarPostagensPorEditoria(idEditoria);
            if (listaDePostagensFiltradas == null)
            {
                return NotFound();
            }
            return Ok(listaDePostagensFiltradas);
        }


        [HttpPost("criar-noticia")]
        public IActionResult CreatePost([FromBody] PostagemResponse postagemResponse)
        {

            // Validação do corpo da requisição
            if (postagemResponse is null)
            {
                return BadRequest("Objeto preenchido incorretamente.");
            }

            // Criar a postagem
            var postagem = _postagemService.CriarPostagem(postagemResponse);

            return Ok(postagem); // Retorna a postagem criada com status 200
        }

        [HttpPut("editar/{idPostagem}")]
        public IActionResult UpdatePostagem(int idPostagem, [FromBody] PostagemResponse postagemResponse)
        {
            try
            {
                // Valida se o ID na rota corresponde ao ID no corpo da requisição
                if (idPostagem != postagemResponse.IdPostagem)
                {
                    return BadRequest("Inconsistência entre o ID da URL e o corpo da requisição.");
                }

                // Chama o serviço para atualizar a postagem
                var postagemAtualizada = _postagemService.EditarPostagem(postagemResponse);

                if (postagemAtualizada == null)
                {
                    return NotFound($"Postagem com ID {idPostagem} não encontrada.");
                }

                return Ok(postagemAtualizada);
            }
            catch (Exception ex)
            {
                // Log da exceção (não exibido aqui)
                return StatusCode(500, $"Erro interno no servidor: {ex.Message}");
            }
        }

        [HttpPut("ativar-desativar/{idPostagem}")]
        public IActionResult SwapFlagColaborador(int idPostagem)
        {
            try
            {
                var colaborador = _postagemService.TrocarFlagAtivaPostagem(idPostagem);
                return Ok(colaborador);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpGet("listar-editorias")]
        public IActionResult ListarEditorias()
        {
            try
            {
                List<EditoriaDTO> editorias = _postagemService.ListarEditorias();
                return Ok(editorias);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpGet("listar-status")]
        public IActionResult ListarStatus()
        {
            try
            {
                List<StatusDTO> status = _postagemService.ListarStatus();
                return Ok(status);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }



    }
}
