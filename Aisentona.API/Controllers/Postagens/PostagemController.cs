using Aisentona.Biz.Services;
using Aisentona.Biz.Services.Postagens;
using Aisentona.DataBase;
using Aisentona.Entities.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Aisentona.API.Controllers.Postagens
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostagemController : ControllerBase
    {
        private readonly PostagemService _postagemService;
        private readonly ApplicationDbContext _context;

        public PostagemController(PostagemService postagemService, ApplicationDbContext context)
        {
            _postagemService = postagemService;
            _context = context;
        }

        [HttpGet("{id}")]
        public IActionResult CarregarNotícia(int id)
        {
            if (id <= 0)
            {
                return BadRequest("ID inválido.");
            }

            PostagemDTO postagemDto = _postagemService.CarregarPostagem(id);
            if (postagemDto == null)
            {
                return NotFound();
            }
            return Ok(postagemDto);
        }

        [HttpGet]
        public IActionResult CarregarListaDePostagens()
        {
            List<PostagemDTO> listaDePostagens = _postagemService.ListarPostagens();
            if (listaDePostagens == null)
            {
                return NotFound();
            }
            return Ok(listaDePostagens);
        }

        [HttpGet("listar-ultimas-postagens")]
        public IActionResult ListarUltimasPostagens()
        {
            List<PostagemDTO> listaDePostagens = _postagemService.ListarUltimasPostagens();
            if (listaDePostagens == null)
            {
                return NotFound();
            }
            return Ok(listaDePostagens);
        }


        [HttpPost]
        public IActionResult CreatePost([FromBody] PostagemDTO postagemDTO)
        {
            if (postagemDTO is null)
            {
                return BadRequest("Objeto preenchido incorretamente");
            }

            var postagem = _postagemService.CriarPostagem(postagemDTO);

            return Ok(postagem);
        }
        
        [HttpPut("editar/{idPostagem}")]
        public IActionResult UpdatePostagem(PostagemDTO postagemDTO)
        {
            try
            {
                Postagem postagem = new();

                postagem = _postagemService.EditarPostagem(postagemDTO);
                
                return Ok(postagemDTO);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
        
        // Delete api/<ColaboradorController>
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
