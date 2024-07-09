using Aisentona.Biz.Services;
using Aisentona.DataBase;
using Aisentona.Entities.Request;
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
        public IActionResult CreateColaborador([FromBody] ColaboradorRequest colaboradorObjeto)
        {
            if (colaboradorObjeto is null)
            {
                return BadRequest("Objeto preenchido incorretamente");
            }

            // Criar um novo colaborador usando o serviço
            var novoColaborador = _colaboradorService.CriarColaborador(
                colaboradorObjeto.Nome,
                colaboradorObjeto.CPF,
                colaboradorObjeto.Senha,
                colaboradorObjeto.TipoUsuario
            );

            if (novoColaborador == null)
            {
                return BadRequest("Não foi possível criar o colaborador");
            }

            // Retornar um código 201 (Created) com o novo colaborador criado
            return CreatedAtAction(nameof(CreateColaborador), new { id = novoColaborador.Id_Usuario }, novoColaborador);
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
