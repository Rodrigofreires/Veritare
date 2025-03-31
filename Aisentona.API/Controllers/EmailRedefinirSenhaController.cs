using Aisentona.Biz.Services.Email;
using Aisentona.Entities.Request;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Aisentona.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailRedefinirSenhaController : ControllerBase
    {
        private readonly EmailRedefinirSenhaService _emailRedefinirSenhaService;

        public EmailRedefinirSenhaController(EmailRedefinirSenhaService emailRedefinirSenhaService)
        {
            _emailRedefinirSenhaService = emailRedefinirSenhaService;
        }

        /// <summary>
        /// Endpoint para enviar o e-mail de solicitação de redefinição de senha.
        /// </summary>
        [HttpPost("solicitar")]
        public IActionResult SolicitarRedefinicaoSenha([FromBody] string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return BadRequest("O e-mail não pode ser vazio.");

            try
            {
                _emailRedefinirSenhaService.EnviarEmailRedefinirSenha(email);
                return Ok("E-mail de redefinição enviado com sucesso.");
            }
            catch (Exception ex)
            {
                return BadRequest($"Erro ao enviar e-mail: {ex.Message}");
            }
        }



        /// <summary>
        /// Endpoint para redefinir a senha do usuário.
        /// </summary>
        [HttpPost("redefinir")]
        public async Task<IActionResult> RedefinirSenha([FromBody] RedefinirSenhaRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.NovaSenha) || string.IsNullOrWhiteSpace(request.ConfirmarSenha))
                return BadRequest("As senhas não podem estar vazias.");

            if (request.NovaSenha != request.ConfirmarSenha)
                return BadRequest("As senhas não coincidem.");

            var resultado = await Task.Run(() => _emailRedefinirSenhaService.RedefinirSenha(request.Token, request.NovaSenha));

            if (resultado != "Senha redefinida com sucesso.")
                return BadRequest(resultado);

            return Ok(resultado);
        }
    }
}
