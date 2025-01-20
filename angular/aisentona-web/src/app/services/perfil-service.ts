import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { PerfilDeUsuarioRequest } from '../core/interfaces/Request/PerfilDeUsuario';

@Injectable({
  providedIn: 'root',
})
export class PerfilService {

  private apiUrl = environment.apiUrl;
  private API = 'colaborador';

  constructor(private http: HttpClient) {}

  // LISTAR PERFIL DO USUÁRIO
  carregarPerfilDoUsuario(idUsuario: number): Observable<PerfilDeUsuarioRequest> {
    return this.http.get<PerfilDeUsuarioRequest>(`${this.apiUrl}/colaborador/perfil-usuario/${idUsuario}`, {
      headers: {
        'Content-Type': 'application/json', // Certifique-se de que o cabeçalho está correto
      }
    });
  }

  // EXCLUIR PERFIL DO USUÁRIO
  excluirPerfilDoUsuario(idUsuario: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/colaborador/ativar-desativar/${idUsuario}`, {
    });
  }

}
