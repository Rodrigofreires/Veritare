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
        public IActionResult SolicitarRedefinicaoSenha([FromBody] EmailRedefinirSenhaRequest emailRedefinirSenhaRequest)
        {
            if (string.IsNullOrWhiteSpace(emailRedefinirSenhaRequest.Email))
                return BadRequest(new { erro = "O e-mail não pode ser vazio." });

            try
            {
                _emailRedefinirSenhaService.EnviarEmailRedefinirSenha(emailRedefinirSenhaRequest.Email);
                return Ok(new { mensagem = "E-mail de redefinição enviado com sucesso." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { erro = $"Erro ao enviar e-mail: {ex.Message}" });
            }
        }




        /// <summary>
        /// Endpoint para redefinir a senha do usuário.
        /// </summary>
        [HttpPost("redefinir")]
        public async Task<IActionResult> RedefinirSenha([FromBody] RedefinirSenhaRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.NovaSenha) || string.IsNullOrWhiteSpace(request.ConfirmarSenha))
                return BadRequest(new { erro = "As senhas não podem estar vazias." });

            if (request.NovaSenha != request.ConfirmarSenha)
                return BadRequest(new { erro = "As senhas não coincidem." });

            var resultado = await Task.Run(() => _emailRedefinirSenhaService.RedefinirSenha(request.Token, request.NovaSenha));

            if (resultado != "Senha redefinida com sucesso.")
                return BadRequest(new { erro = resultado });

            return Ok(new { mensagem = resultado });
        }

    }
}
