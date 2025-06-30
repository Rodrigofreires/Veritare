// Aisentona.API.Controllers/EmailEnviarPromptController.cs
using Aisentona.Biz.Services.Email;
using Aisentona.Entities.Request;
using Microsoft.AspNetCore.Http; // Para StatusCodes
using Microsoft.AspNetCore.Mvc;
using System; // Para Exception

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
        /// <param name="request">Objeto contendo o nome e o e-mail do solicitante.</param>
        [HttpPost("solicitar-prompt")]
        public IActionResult SolicitarPrompt([FromBody] EmailPromptRequest request) 
        {
            // Validação explícita do objeto e suas propriedades
            if (request == null)
            {
                return BadRequest(new { erro = "Dados da requisição inválidos." });
            }
            if (string.IsNullOrWhiteSpace(request.Email))
            {
                return BadRequest(new { erro = "O e-mail não pode ser vazio." });
            }
            if (string.IsNullOrWhiteSpace(request.Nome))
            {
                return BadRequest(new { erro = "O nome não pode ser vazio." });
            }

            try
            {
                _emailEnviarPromptService.EnviarEmailComPrompt(request);
                // Retorno de sucesso
                return Ok(new { mensagem = "E-mail de solicitação enviado com sucesso! Verifique sua caixa de entrada." });
            }
            catch (InvalidOperationException ex)
            {
                // Captura exceções da lógica de negócio (ex: trava de 20 dias)
                // Retorna 400 Bad Request com a mensagem específica
                return BadRequest(new { erro = ex.Message });
            }
            catch (Exception ex)
            {
                // Captura quaisquer outras exceções inesperadas
                // Retorna 500 Internal Server Error para erros não tratados
                Console.WriteLine($"Erro interno no controller EmailEnviarPrompt: {ex.Message} - {ex.InnerException?.Message}"); // Logar o erro completo
                return StatusCode(StatusCodes.Status500InternalServerError, new { erro = "Ocorreu um erro interno ao processar sua solicitação. Por favor, tente novamente mais tarde." });
            }
        }
    }
}