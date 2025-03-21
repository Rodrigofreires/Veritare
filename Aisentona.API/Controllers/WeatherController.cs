using Aisentona.Biz.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

[ApiController]
[Route("api/weather")]
public class WeatherController : ControllerBase
{
    private readonly WeatherService _weatherService;

    public WeatherController(WeatherService weatherService)
    {
        _weatherService = weatherService;
    }

    [HttpGet]
    public async Task<IActionResult> GetWeather([FromQuery] double lat, [FromQuery] double lon)
    {
        var weather = await _weatherService.GetWeatherAsync(lat, lon);
        if (weather == null)
            return NotFound("Não foi possível obter a previsão do tempo.");

        return Ok(weather);
    }
}
