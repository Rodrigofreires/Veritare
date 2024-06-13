using Aisentona.Biz.Services;
using Aisentona.DataBase;
using Microsoft.AspNetCore.Mvc;

namespace Aisentona.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ColaboradorEmailController : ControllerBase
    {
        private readonly ColaboradorEmailService _colaboradorEmailService;

        public ColaboradorEmailController(ColaboradorEmailService colaboradorEmailService)
        {
            _colaboradorEmailService = colaboradorEmailService;
        }

        // GET api/<ColaboradorEmailController>
        [HttpGet("{id}")]
        public IActionResult GetEmailColaboradorById(int id)
        {
            if (id <= 0)
            {
                return BadRequest("ID inválido.");
            }

            var colaborador = _colaboradorEmailService.ListarEmailColaboradorPorId(id);
            if (colaborador == null)
            {
                return NotFound();
            }
            return Ok(colaborador);
        }

        // POST api/<ColaboradorController>
        [HttpPost]
        public IActionResult CreateEmailColaborador([FromBody] ColaboradorEmail colaboradorObjeto)
        {
            if (colaboradorObjeto is null)
            {
                return BadRequest("Objeto preenchido incorretamente");
            }
            var colaborador = _colaboradorEmailService.CriarEmailColaborador(

                colaboradorObjeto.Id_Email,
                colaboradorObjeto.Ds_Email,
                colaboradorObjeto.Fl_Ativo,
                colaboradorObjeto.Id_Usuario
                );

            return CreatedAtAction(nameof(CreateEmailColaborador), new { id = colaborador.Id_Email }, colaborador);
        }

        // PUT api/<ColaboradorController>
        [HttpPut("editar/{id}")]
        public IActionResult UpdateEmailColaborador(int id, [FromBody] ColaboradorEmail colaboradorEmailDto)
        {
            if (colaboradorEmailDto == null)
            {
                return BadRequest("Objeto preenchido incorretamente");
            }

            try
            {
                var colaboradorEmail = _colaboradorEmailService.EditarEmailColaborador(id, colaboradorEmailDto);

                return Ok(colaboradorEmail);
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
                var colaboradorEmail = _colaboradorEmailService.TrocarFlagAtivaEmailColaborador(id);
                return Ok(colaboradorEmail);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
