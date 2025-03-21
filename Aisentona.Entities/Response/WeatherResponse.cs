using System.Text.Json.Serialization;

namespace Aisentona.Entities.Response
{
    public class WeatherResponse
    {
        [JsonPropertyName("properties")]
        public WeatherProperties Properties { get; set; }
    }

    public class WeatherProperties
    {
        [JsonPropertyName("timeseries")]
        public TimeSeries[] TimeSeries { get; set; }
    }

    public class TimeSeries
    {
        [JsonPropertyName("time")]
        public string Time { get; set; }

        [JsonPropertyName("data")]
        public WeatherData Data { get; set; }
    }

    public class WeatherData
    {
        [JsonPropertyName("instant")]
        public Instant Instant { get; set; }
    }

    public class Instant
    {
        [JsonPropertyName("details")]
        public WeatherDetails Details { get; set; }
    }

    public class WeatherDetails
    {
        [JsonPropertyName("air_temperature")]
        public double Temperature { get; set; }
    }
}
