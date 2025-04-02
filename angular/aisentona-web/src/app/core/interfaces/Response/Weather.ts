export interface WeatherResponse {
  properties: {
    timeseries: TimeSeries[];
  };
}

export interface TimeSeries {
  time: string; // Data e hora da previsão
  data: {
    instant: {
      details: {
        air_temperature: number; // Temperatura do ar
      };
    };
    next_12_hours: { // Previsões para as próximas 12 horas (exemplo de como adicionar mais previsões)
      summary: {
        symbol_code: string; // Código do símbolo do clima (ex: "clear", "cloudy", "rainy")
        symbol_name: string; // Nome completo do símbolo (ex: "Céu limpo", "Nublado", "Chuvoso")
      };
    };
  };
}
