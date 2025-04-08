import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { PerfilDeUsuarioRequest } from '../core/interfaces/Request/PerfilDeUsuario';
import { PerfilDeUsuarioResponse } from '../core/interfaces/Response/PerfilDeUsuario';
import { AuthService } from './auth.service';
import { TipoDeUsuarioRequest } from '../core/interfaces/Request/TipoDeUsuário';

@Injectable({
  providedIn: 'root',
})
export class PerfilService {


  private apiUrl = environment.apiUrl;
  private API = 'colaborador';

  constructor(private http: HttpClient) {}


  // LISTAR TODOS OS PERFIS DOS USUÁRIOS
  carregarTodosOsPerfis(): Observable<PerfilDeUsuarioRequest[]> {
    return this.http.get<PerfilDeUsuarioRequest[]>(`${this.apiUrl}/colaborador/lista-perfil-usuarios`, {
      headers: {
        'Content-Type': 'application/json', // Certifique-se de que o cabeçalho está correto
      }
    });
  }

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

  // LISTAR COM FILTROS
  carregarTodasOsUsuariosPorFiltro(filtros: PerfilDeUsuarioResponse): Observable<PerfilDeUsuarioRequest[]> {
  return this.http.post<PerfilDeUsuarioRequest[]>(`${this.apiUrl}/${this.API}/listar-usuarios-filtros`, filtros, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

// LISTAR COM TIPOS DE USUÁRIOS
buscarTiposDeUsuarios(): Observable<TipoDeUsuarioRequest[]> {
  return this.http.get<TipoDeUsuarioRequest[]>(`${this.apiUrl}/ColaboradorTipoUsuario`, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

// ATUALIZAR PERFIL DO USUÁRIO
atualizarPerfil(perfilDeUsuario: PerfilDeUsuarioRequest): Observable<void> {
  return this.http.put<void>(`${this.apiUrl}/colaborador/editar-perfil-usuario`, perfilDeUsuario, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
}


}
