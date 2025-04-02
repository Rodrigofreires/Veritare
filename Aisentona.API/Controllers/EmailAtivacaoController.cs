using Microsoft.AspNetCore.Mvc;
using Aisentona.Biz.Services.Email;

namespace Aisentona.API.Controllers
{
    [ApiController]
    [Route("api/emailAtivacao")]
    public class EmailAtivacaoController : ControllerBase
    {
        private readonly EmailAtivacaoService _emailAtivacaoService;

        public EmailAtivacaoController(EmailAtivacaoService emailAtivacaoService)
        {
            _emailAtivacaoService = emailAtivacaoService;
        }

        [HttpGet("ativar-conta")]
        public IActionResult AtivarConta([FromQuery] string token)
        {
            var resultado = _emailAtivacaoService.AtivarConta(token);

            if (resultado == "Conta ativada com sucesso.")
            {
                return Ok(resultado);
            }

            return BadRequest(resultado);
        }
    }
}
