import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development'; // Ajuste o caminho se necessário
import { AuthService } from './auth.service'; // Mantenha se precisar de autenticação
import { EmailPromptRequest } from '../core/interfaces/Request/EmailPrompt';

@Injectable({
  providedIn: 'root'
})
export class PromptService {

  private apiUrl = environment.apiUrl;
  private EMAIL_PROMPT_API = 'EmailEnviarPrompt'; // Define o segmento da rota para prompts de e-mail

  constructor(
    private http: HttpClient,
    private _authService: AuthService // Mantenha se esta rota exigir autenticação
  ) { }

  /**
   * Envia uma requisição para solicitar o prompt completo por e-mail.
   * @param payload Objeto contendo o nome e o email do solicitante.
   * @returns Um Observable de string com a resposta da API (e.g., mensagem de sucesso/erro).
   */
  solicitarPrompt(payload: EmailPromptRequest): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // Constrói a URL completa: base_url/api/EmailEnviarPrompt/solicitar-prompt
    return this.http.post<string>(`${this.apiUrl}/${this.EMAIL_PROMPT_API}/solicitar-prompt`, payload, {
      headers,
      responseType: 'text' as 'json' // Espera uma resposta de texto da API
    });
  }
}