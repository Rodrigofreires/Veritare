using Aisentona.Biz.Services;
using Aisentona.DataBase;
using Microsoft.AspNetCore.Mvc;

namespace Aisentona.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ColaboradorController : ControllerBase
    {
        private readonly ColaboradorService _colaboradorService;

        public ColaboradorController(ColaboradorService colaboradorService)
        {
            _colaboradorService = colaboradorService;
        }

        // GET api/<ColaboradorController>
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            if (id <= 0)
            {
                return BadRequest("ID inválido.");
            }

            var colaborador = _colaboradorService.ListarColaboradorPorId(id);
            if (colaborador == null)
            {
                return NotFound();
            }
            return Ok(colaborador);
        }

        // POST api/<ColaboradorController>
        [HttpPost]
        public IActionResult CreateColaborador([FromBody] Colaborador colaboradorObjeto)
        {
            if (colaboradorObjeto is null)
            {
                return BadRequest("Objeto preenchido incorretamente");
            }

            var colaborador = _colaboradorService.CriarColaborador(
                colaboradorObjeto.Nm_Nome,
                colaboradorObjeto.Ds_CPF,
                colaboradorObjeto.DS_Senha,
                colaboradorObjeto.Id_TipoUsuario
            );

            return CreatedAtAction(nameof(CreateColaborador), new { id = colaborador.Id_Usuario }, colaborador);
        }

        // PUT api/<ColaboradorController>
        [HttpPut("editar/{id}")]
        public IActionResult UpdateColaborador(int id, [FromBody] Colaborador colaboradorDto)
        {
            if (colaboradorDto == null)
            {
                return BadRequest("Objeto preenchido incorretamente");
            }

            try
            {
                var colaborador = _colaboradorService.EditarColaborador(id, colaboradorDto);

                return Ok(colaborador);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        // Delete api/<ColaboradorController>
        [HttpPut("ativar-desativar/{id}")]
        public IActionResult SwapFlagColaborador(int id)
        {
            try
            {
                var colaborador = _colaboradorService.TrocarFlagAtivaColaborador(id);
                return Ok(colaborador);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
