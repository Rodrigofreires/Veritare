using Aisentona.Biz.Services;
using Aisentona.DataBase;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Aisentona.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ColaboradorTipoUsuarioController : ControllerBase
    {
        private readonly ColaboradorTipoUsuarioService _colaboradorTipoUsuarioService;

        public ColaboradorTipoUsuarioController(ColaboradorTipoUsuarioService colaboradorTipoUsuarioService)
        {
            _colaboradorTipoUsuarioService = colaboradorTipoUsuarioService;
        }

        // GET api/<ColaboradorController>
        [HttpGet]
        public IActionResult GetAllColaboradorTipoUsuarioById()
        {

            List<ColaboradorTipoUsuario> ListaColaboradorTipoUsuario = _colaboradorTipoUsuarioService.ListarColaboradorTipoUsuarioPorId();
            if (ListaColaboradorTipoUsuario == null)
            {
                return NotFound();
            }
            return Ok(ListaColaboradorTipoUsuario);
        }

        // POST api/<ColaboradorController>
        [HttpPost("criar")]
        public IActionResult CreateColaboradorTipoUsuario([FromBody] ColaboradorTipoUsuario colaboradorTipoUsuarioObjeto)
        {
            if (colaboradorTipoUsuarioObjeto is null)
            {
                return BadRequest("Objeto preenchido incorretamente");
            }

            var colaboradorTipoUsuario = _colaboradorTipoUsuarioService.CriarColaboradorTipoUsuario(
                colaboradorTipoUsuarioObjeto.Nm_TipoUsuario,
                colaboradorTipoUsuarioObjeto.Id_TipoUsuario
            );

            return CreatedAtAction(nameof(CreateColaboradorTipoUsuario), new { id = colaboradorTipoUsuario.Id_TipoUsuario }, colaboradorTipoUsuario);
        }

        // PUT api/<ColaboradorController>
        [HttpPut("editar/{id}")]
        public IActionResult UpdateColaboradorTipoUsuario(int id, [FromBody] ColaboradorTipoUsuario colaboradorTipoUsuarioDto)
        {
            if (colaboradorTipoUsuarioDto == null)
            {
                return BadRequest("Objeto preenchido incorretamente");
            }

            try
            {
                var colaboradorTipousuario = _colaboradorTipoUsuarioService.EditarColaboradorTipoUsuario(id, colaboradorTipoUsuarioDto);
                return Ok(colaboradorTipousuario);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        // Delete api/<ColaboradorController>
        [HttpPut("ativar-desativar/{id}")]
        public IActionResult SwapFlagColaboradorTipoUsuario(int id)
        {
            try
            {
                var colaboradorTipoUsuario = _colaboradorTipoUsuarioService.TrocarFlagAtivaColaborador(id);
                return Ok(colaboradorTipoUsuario);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
