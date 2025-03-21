using Aisentona.Entities.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Aisentona.Biz.Services
{
    public class WeatherService
    {
        private readonly HttpClient _httpClient;

        public WeatherService()
        {
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Add("User-Agent", "SeuNomeOuEmail"); // Obrigatório para Met.no
        }

        public async Task<WeatherResponse> GetWeatherAsync(double latitude, double longitude)
        {
            string url = $"https://api.met.no/weatherapi/locationforecast/2.0/compact?lat={latitude}&lon={longitude}";

            HttpResponseMessage response = await _httpClient.GetAsync(url);

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Erro ao obter previsão do tempo: {response.StatusCode}");
            }

            string jsonResponse = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<WeatherResponse>(jsonResponse, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }
    }
}
