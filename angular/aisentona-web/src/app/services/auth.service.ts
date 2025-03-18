import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';
import { PlatformService } from './platform.service';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly TOKEN_KEY = 'token';
  private readonly API = environment.apiUrl; // A URL da API é extraída do environment

  //private readonly API_AUTH = 'auth'; // O endpoint de autenticação é armazenado em uma constante

  constructor(
    private http: HttpClient,
    private platformService: PlatformService,
    private _loginSerivce: LoginService
  
  ) {}

  // Verificar se o Token expirou

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) {
      return true; // Sem token, considera expirado
    }
    try {
      const decodedToken: any = jwtDecode(token);
      const exp = decodedToken.exp;
      if (!exp) {
        return true; // Se não houver expiração, trata como expirado
      }
      return Date.now() >= exp * 1000; // Compara com a data atual
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return true; // Se houver erro, trata como expirado
    }
  }

  // Verifica se o token existe (usuário está logado)
  isLoggedIn(): boolean {
    if (this.platformService.isBrowser()) {
      const token = localStorage.getItem(this.TOKEN_KEY);
      if (!token || this.isTokenExpired()) {
        this._loginSerivce.logout(); // Remove o token se estiver expirado
        return false;
      }
      return true;
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
    return idTipoUsuario !== '5' && idTipoUsuario !== '11';
  }

  acessarEditarNoticia(): boolean {
    const decodedToken = this.getDecodedToken();
    if (!decodedToken) {
      return false;
    }
    const idTipoUsuario = decodedToken.IdTipoUsuario;
    return idTipoUsuario !== '5' && idTipoUsuario !== '11';
  }



  getTipoUsuario(): string {
    const decodedToken = this.getDecodedToken();
    return decodedToken?.IdTipoUsuario?.toString() || ''; // Garante que seja uma string
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
