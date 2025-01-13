using Aisentona.Biz.Services;
using Aisentona.DataBase;
using Aisentona.Entities.Request;
using Aisentona.Entities.Response;
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
        public IActionResult CreateColaborador([FromBody] ColaboradorResponse colaboradorResponse)
        {
            if (colaboradorResponse is null)
            {
                return BadRequest("Objeto preenchido incorretamente");
            }

            // Criar um novo colaborador usando o serviço
            var novoColaborador = _colaboradorService.CriarColaborador(colaboradorResponse);

            if (novoColaborador == null)
            {
                return BadRequest("Não foi possível criar o colaborador");
            }

            // Retornar um código 201 (Created) com o novo colaborador criado
            return CreatedAtAction(nameof(CreateColaborador), new { id = novoColaborador.Id_Usuario }, new { novoColaborador.Id_Usuario });

        }

        // PUT api/<ColaboradorController>
        [HttpPut("editar/{id}")]
        public IActionResult UpdateColaborador(int id, [FromBody] ColaboradorRequest colaboradorRequest)
        {
            if (colaboradorRequest == null)
            {
                return BadRequest("Objeto preenchido incorretamente");
            }

            try
            {
                var colaborador = _colaboradorService.EditarColaborador(id, colaboradorRequest);

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
