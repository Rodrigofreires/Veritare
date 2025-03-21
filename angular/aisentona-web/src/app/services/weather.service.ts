import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WeatherResponse } from '../core/interfaces/Response/Weather';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = 'https://api.met.no/weatherapi/locationforecast/2.0/compact';

  constructor(private http: HttpClient) { }

  getWeather(latitude: number, longitude: number): Observable<WeatherResponse> { {
    const headers = { 'User-Agent': 'VeritareNews/1.0 (rodrigofreires05@gmail.com)' };

    const url = `${this.apiUrl}?lat=${latitude}&lon=${longitude}`;

    return this.http.get<WeatherResponse>(url, { headers });
  }
}

}
