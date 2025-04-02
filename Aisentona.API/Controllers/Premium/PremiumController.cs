using Aisentona.Biz.Services.Premium;
using Aisentona.Entities.Response;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Aisentona.API.Controllers.Premium
{
    [Route("api/[controller]")]
    [ApiController]
    public class PremiumController : ControllerBase
    {
        private readonly PremiumService _premiumService;

        public PremiumController(PremiumService premiumService)
        {
            _premiumService = premiumService;
        }

        [HttpPost("tornar-premium")]
        public IActionResult TornarUsuarioPremium([FromBody] PremiumResponse premiumResponse)
        {
            if (premiumResponse == null)
            {
                return BadRequest("Dados do plano não fornecidos.");
            }

            try
            {
                // Chama o serviço para tornar o usuário premium
                _premiumService.TornarUsuarioPremium(premiumResponse);

                return Ok("Usuário tornado Premium com sucesso.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao tornar o usuário Premium: {ex.Message}");
            }
        }

        [HttpPost("tirar-premium")]
        public IActionResult TirarUsuarioPremium([FromBody] PremiumResponse premiumResponse)
        {
            if (premiumResponse == null)
            {
                return BadRequest("Dados do plano não fornecidos.");
            }

            try
            {
                // Chama o serviço para tornar o usuário premium
                _premiumService.TirarUsuarioPremium(premiumResponse);

                return Ok("Status Premium do usuário removido com sucesso.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao tornar o usuário Premium: {ex.Message}");
            }
        }
    }
}
