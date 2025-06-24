import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { AuthService } from './auth.service';
import { PremiumResponse } from '../core/interfaces/Response/Premium';

@Injectable({
  providedIn: 'root'
})
export class PremiumService {

  private apiUrl = environment.apiUrl;
  private PREMIUM_API = 'premium';

  constructor(
    private http: HttpClient,
    private _authService: AuthService
  ) { }

  /**
   * Envia requisição para tornar o usuário Premium.
   */
  tornarUsuarioPremium(payload: PremiumResponse): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<string>(`${this.apiUrl}/${this.PREMIUM_API}/tornar-premium`, payload, {
      headers,
      responseType: 'text' as 'json'
    });
  }

  /**
   * Envia requisição para remover status Premium do usuário.
   */
  tirarUsuarioPremium(payload: PremiumResponse): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<string>(`${this.apiUrl}/${this.PREMIUM_API}/tirar-premium`, payload, {
      headers,
      responseType: 'text' as 'json'
    });
  }
}
