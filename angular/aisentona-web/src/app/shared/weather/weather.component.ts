import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
  standalone: true,
  providers: [DatePipe],
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatDivider,
  ]
})
export class WeatherComponent implements OnInit {
  weatherData: any;
  temperatura: number | undefined;
  local: string = "Carregando..."; // Inicializando com "Carregando..." até capturar a localização
  dataHoje: string | undefined;
  diaDaSemana: string | undefined;
  previsaoFutura: any[] = [];

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.getWeatherData();
    this.getUserLocation(); // Capturar a localização assim que o componente for inicializado

    // Obter data atual e dia da semana
    const today = new Date();
    this.dataHoje = today.toLocaleDateString('pt-BR'); // Exemplo: 21/03/2025
    this.diaDaSemana = today.toLocaleDateString('pt-BR', { weekday: 'long' }); // Exemplo: sexta-feira
  }

  getWeatherData(): void {
    const latitude = -23.5505; // São Paulo (pode ser dinâmico)
    const longitude = -46.6333; // São Paulo (pode ser dinâmico)

    this.weatherService.getWeather(latitude, longitude).subscribe({
      next: (data) => {
        this.weatherData = data;
        this.temperatura = data.properties.timeseries[0].data.instant.details.air_temperature;

        // Extrair previsão dos próximos dias
        this.previsaoFutura = data.properties.timeseries.slice(1, 6).map((item: any, index: number) => {
          const forecastDate = new Date(item.time);

          forecastDate.setDate(forecastDate.getDate() + index);

          return {
            data: item.time,
            temperatura: item.data.instant.details.air_temperature,
            diaDaSemana: forecastDate.toLocaleDateString('pt-BR', { weekday: 'long' }),
            dataFormatada: forecastDate.toLocaleDateString('pt-BR')
          };
        });
      },
      error: (err) => {
        console.error('Erro ao buscar previsão do tempo:', err);
      }
    });
  }

  getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        this.getCityName(lat, lon); // Obter o nome da cidade com base nas coordenadas
      }, (error) => {
        console.error('Erro ao obter localização:', error);
        this.local = "Localização não disponível";
      });
    } else {
      this.local = "Geolocalização não suportada pelo navegador";
    }
  }

  getCityName(lat: number, lon: number): void {
    const apiKey = 'ac0b88747bb443b3a7767afe0e7eef96'; // Substitua com sua chave da API de geocodificação
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.results && data.results.length > 0) {
          const city = data.results[0].components.city || data.results[0].components.town || data.results[0].components.village;
          this.local = city ? city : "Localização não identificada";
        } else {
          this.local = "Cidade não encontrada";
        }
      })
      .catch(error => {
        console.error('Erro ao obter o nome da cidade:', error);
        this.local = "Erro ao buscar cidade";
      });
  }
}
