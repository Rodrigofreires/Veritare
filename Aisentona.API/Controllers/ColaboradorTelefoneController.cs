using Aisentona.Biz.Services;
using Aisentona.DataBase;
using Aisentona.Entities.Request;
using Microsoft.AspNetCore.Mvc;

namespace Aisentona.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ColaboradorTelefoneController : ControllerBase
    {
        private readonly ColaboradorTelefoneService _colaboradorTelefoneService;

        public ColaboradorTelefoneController(ColaboradorTelefoneService colaboradorTelefoneService)
        {
            _colaboradorTelefoneService = colaboradorTelefoneService;
        }

        // GET api/<ColaboradorEmailController>
        [HttpGet("{id}")]
        public IActionResult GetTelefoneColaboradorById(int id)
        {
            if (id <= 0)
            {
                return BadRequest("ID inválido.");
            }

            var colaborador = _colaboradorTelefoneService.ListarTelefoneColaboradorPorId(id);
            if (colaborador == null)
            {
                return NotFound();
            }
            return Ok(colaborador);
        }

        // POST api/<ColaboradorController>
        [HttpPost]
        [Route("api/[controller]")]
        public IActionResult CreateTelefoneColaborador([FromBody] TelefoneRequest telefoneRequest)
        {
            if (telefoneRequest is null)
            {
                return BadRequest("Objeto preenchido incorretamente");
            }
            var colaborador = _colaboradorTelefoneService.CriarTelefoneColaborador(telefoneRequest);

            return CreatedAtAction(nameof(CreateTelefoneColaborador), new { id_Telefone = colaborador.Id_Telefone }, colaborador);

        }

        // PUT api/<ColaboradorController>
        [HttpPut("editar/{id}")]
        public IActionResult UpdateEmailColaborador(int id, [FromBody] TelefoneRequest telefoneRequest)
        {
            if (telefoneRequest == null)
            {
                return BadRequest("Objeto preenchido incorretamente");
            }

            try
            {
                ColaboradorTelefone colaboradorTelefone = _colaboradorTelefoneService.EditarTelefoneColaborador(telefoneRequest);

                return Ok(colaboradorTelefone);
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
                var colaboradorTelefone = _colaboradorTelefoneService.TrocarFlagAtivaTelefoneColaborador(id);
                return Ok(colaboradorTelefone);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
