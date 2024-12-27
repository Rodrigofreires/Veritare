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
        public IActionResult GetById(int id)
        {
            if (id <= 0)
            {
                return BadRequest("ID inválido.");
            }

            List<Postagem> postagem = _postagemService.ListarPostagens(id);
            if (postagem == null)
            {
                return NotFound();
            }
            return Ok(postagem);
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



    }
}
