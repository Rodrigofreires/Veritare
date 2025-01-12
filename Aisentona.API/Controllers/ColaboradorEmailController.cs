using Aisentona.Biz.Services;
using Aisentona.DataBase;
using Aisentona.Entities.Request;
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
        public IActionResult GetEmailListById(int id)
        {
            if (id <= 0)
            {
                return BadRequest("ID inválido.");
            }

            List<ColaboradorEmail> listaDeEmails = _colaboradorEmailService.ListarEmailColaboradorPorId(id);
            if (listaDeEmails == null)
            {
                return NotFound();
            }
            return Ok(listaDeEmails);
        }

        // POST api/<ColaboradorController>
        [HttpPost]
        public IActionResult CreateEmailColaborador([FromBody] EmailRequest emailRequest)
        {
            if (emailRequest is null)
            {
                return BadRequest("Objeto preenchido incorretamente");
            }
            var colaborador = _colaboradorEmailService.CriarEmailColaborador(emailRequest);

            return CreatedAtAction(nameof(CreateEmailColaborador), new { id = colaborador.Id_Email }, colaborador);
        }

        // PUT api/<ColaboradorController>
        [HttpPut("editar/{id}")]
        public IActionResult UpdateEmailColaborador(int id, [FromBody] EmailRequest emailRequest)
        {
            if (emailRequest == null)
            {
                return BadRequest("Objeto preenchido incorretamente");
            }

            try
            {
                var colaboradorEmail = _colaboradorEmailService.EditarEmailColaborador(emailRequest);

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
