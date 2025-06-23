using Aisentona.Biz.Services;
using Aisentona.Biz.Services.Postagens;
using Aisentona.DataBase;
using Aisentona.Entities.Request;
using Aisentona.Entities.Response;
using Aisentona.Entities.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
        public async Task<IActionResult> GetNoticiaById(int id)
        {
            if (id <= 0)
                return BadRequest("ID inválido.");

            var postagem = _postagemService.CarregarPostagemPorId(id);

            if (postagem == null)
                return NotFound();

            await _postagemService.IncrementarVisualizacoesAsync(id);

            return Ok(postagem);
        }

        [HttpGet("listar-postagens-paginadas")]
        public IActionResult CarregarListaDePostagens(int pagina = 1, int quantidadePorPagina = 10)
        {
            var dados = _postagemService.ListarPostagensPaginadas(pagina, quantidadePorPagina);
            var total = _postagemService.ContarTotalDePostagens();

            return Ok(new PostagensPaginadasDTO { Total = total, Dados = dados });
        }

        [HttpPost("listar-postagens/filtros")]
        public IActionResult CarregarTodasAsPostagensPorFiltro([FromBody] PostagemResponse filtro)
        {
            if (filtro == null)
                return BadRequest("Filtros não fornecidos.");

            var lista = _postagemService.ListarPostagensComFiltro(filtro);
            return lista == null ? NotFound() : Ok(lista);
        }

        [HttpGet("listar-ultimas-postagens")]
        public IActionResult ListarUltimasPostagens()
        {
            var lista = _postagemService.ListarUltimasPostagens();
            return lista == null ? NotFound() : Ok(lista);
        }

        [HttpGet("listar-ultimas-postagens-premium")]
        public IActionResult ListarUltimasPostagensPremium()
        {
            var lista = _postagemService.ListarUltimasPostagensPremium();
            return lista == null ? NotFound() : Ok(lista);
        }

        [HttpGet("listar-por-editoria/{idEditoria}")]
        public IActionResult FiltrarPostagensPorEditoria(int idEditoria, int pagina = 1, int quantidade = 10)
        {
            var resultado = _postagemService.FiltrarPostagensPorEditoria(idEditoria, pagina, quantidade);
            return resultado?.Dados?.Any() == true ? Ok(resultado) : NotFound("Nenhuma postagem encontrada.");
        }

        [HttpPost("criar-noticia")]
        [Authorize(Policy = "CadastrarPostsSimples")]
        public IActionResult CreatePost([FromBody] PostagemResponse postagemResponse)
        {
            if (postagemResponse == null)
                return BadRequest("Objeto preenchido incorretamente.");

            var postagem = _postagemService.CriarPostagem(postagemResponse);
            return Ok(postagem);
        }

        [HttpPut("editar/{idPostagem}")]
        [Authorize(Policy = "EditarPostsSimples")]
        public IActionResult UpdatePostagem(int idPostagem, [FromBody] PostagemResponse postagemResponse)
        {
            if (idPostagem != postagemResponse.IdPostagem)
                return BadRequest("Inconsistência entre o ID da URL e o corpo da requisição.");

            var atualizada = _postagemService.EditarPostagem(postagemResponse);
            return atualizada == null ? NotFound($"Postagem com ID {idPostagem} não encontrada.") : Ok(atualizada);
        }

        [HttpPut("ativar-desativar/{idPostagem}")]
        [Authorize(Policy = "AlterarStatus")]
        public IActionResult SwapFlagColaborador(int idPostagem)
        {
            try
            {
                var resultado = _postagemService.TrocarFlagAtivaPostagem(idPostagem);
                return Ok(resultado);
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
                var editorias = _postagemService.ListarEditorias();
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
                var status = _postagemService.ListarStatus();
                return Ok(status);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpGet("mais-lidas-semana")]
        [ProducesResponseType(typeof(List<PostagemRequest>), StatusCodes.Status200OK)]
        public ActionResult<List<PostagemRequest>> ObterMaisLidas()
        {
            var maisLidas = _postagemService.ObterMaisLidasUltimaSemana();
            return Ok(maisLidas);
        }
    }
}
