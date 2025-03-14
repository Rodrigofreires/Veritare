import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';
import { PlatformService } from './platform.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly API = environment.apiUrl; // A URL da API é extraída do environment

  constructor(
    private http: HttpClient,
    private platformService: PlatformService
  ) {}

  // Verifica se o token existe (usuário está logado)
  isLoggedIn(): boolean {
    if (this.platformService.isBrowser()) {
      const token = localStorage.getItem('token');
      return !!token; // Retorna true se o token existir
    }
    return false;
  }

  getToken(): string | null {
    if (!this.platformService.isBrowser()) {
      return null; // Não tenta acessar localStorage no SSR
    }
    return localStorage.getItem('token');
  }

  getDecodedToken(): any {
    const token = this.getToken();
    if (token) {
      try {
        return jwtDecode(token);
      } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        return null;
      }
    }
    return null;
  }

  podeAccessarPainelDeControle(): boolean {
    const decodedToken = this.getDecodedToken();
    if (!decodedToken) {
      return false;
    }
    const idTipoUsuario = decodedToken.IdTipoUsuario;
    return idTipoUsuario !== '5' && idTipoUsuario !== '4';
  }

  getTipoUsuario(): string[] {
    const decodedToken = this.getDecodedToken();
    return decodedToken?.IdTipoUsuario;
  }

  getUserName(): string | null {
    const decodedToken = this.getDecodedToken();
    return decodedToken?.unique_name || null;
  }

  getUserId(): number {
    const decodedToken = this.getDecodedToken();
    return decodedToken?.IdUsuario || null;
  }

  getUserPermissions(): string[] {
    const decodedToken = this.getDecodedToken();
    return decodedToken?.Permission || [];
  }

}
