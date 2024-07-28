using Aisentona.Biz.Services;
using Aisentona.Biz.Services.Postagens;
using Aisentona.DataBase;
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
        public IActionResult CreatePost([FromBody] Postagem postagemObjeto)
        {
            if (postagemObjeto is null)
            {
                return BadRequest("Objeto preenchido incorretamente");
            }

            var postagem = _postagemService.CriarPostagem(
                postagemObjeto.Id_Usuario,
                postagemObjeto.Id_Categoria,
                postagemObjeto.Id_Status,
                postagemObjeto.Titulo,
                postagemObjeto.Conteudo
            );

            // Retrieve related entities
            postagem.Status = _context.CF_Postagem_Status.Find(postagemObjeto.Id_Status);
            postagem.Categoria = _context.CF_Postagem_Categoria.Find(postagemObjeto.Id_Categoria);
            postagem.Colaborador = _context.CF_Colaborador.Find(postagemObjeto.Id_Usuario);

            return CreatedAtAction(nameof(CreatePost), new { id = postagem.Id_Usuario }, postagem);
        }
        
        [HttpPut("editar/{idPostagem}")]
        public IActionResult UpdatePostagem(Postagem postagem)
        {
            try
            {
                postagem = _postagemService.EditarPostagem(postagem.Id_Usuario, postagem.Id_Postagem, postagem);
                
                return Ok(postagem);
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

    }
}
