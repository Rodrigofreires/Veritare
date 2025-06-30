using Aisentona.Biz.Services.Email;
using Aisentona.Entities.Request;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Aisentona.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailEnviarPromptController : ControllerBase
    {
        private readonly EmailEnviarPromptService _emailEnviarPromptService;
        public EmailEnviarPromptController(EmailEnviarPromptService emailEnviarPromptService)
        {
            _emailEnviarPromptService = emailEnviarPromptService;
        }

        /// <summary>
        /// Endpoint para enviar o e-mail de solicitação de prompt.
        /// </summary>
        [HttpPost("solicitar-prompt")]
        public IActionResult SolicitarRedefinicaoSenha([FromBody] EmailPromptRequest emailRedefinirSenhaRequest)
        {
            if (string.IsNullOrWhiteSpace(emailRedefinirSenhaRequest.Email))
                return BadRequest(new { erro = "O e-mail não pode ser vazio." });

            try
            {
                _emailEnviarPromptService.EnviarEmailComPrompt(emailRedefinirSenhaRequest);
                return Ok(new { mensagem = "E-mail de redefinição enviado com sucesso." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { erro = $"Erro ao enviar e-mail: {ex.Message}" });
            }
        }


    }
}
