import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'token'; 
  private readonly PERMISSIONS_KEY = 'userPermissions'; // Nome da chave para permissões

  constructor() {}

  // Verifica se o token existe (usuário está logado)
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token; // Retorna true se o token existir
  }

  // Retorna o token armazenado
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Decodifica o token e retorna as informações
  getDecodedToken(): any {
    const token = this.getToken();
    if (token) {
      try {
        return jwtDecode(token); // Decodifica o token usando jwtDecode
      } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        return null;
      }
    }
    return null;
  }

  // Retorna o nome do usuário (campo `unique_name`) do token
  getUserName(): string | null {
    const decodedToken = this.getDecodedToken();
    return decodedToken?.unique_name || null; // Extrai o campo `unique_name`
  }

  // Verifica se o usuário possui uma permissão específica
  hasPermission(permission: string): boolean {
    const decodedToken = this.getDecodedToken();
    if (decodedToken && decodedToken.permissions) {
      return decodedToken.permissions.includes(permission); // Verifica a permissão no token
    }

    // Alternativamente, verifica em outra chave, como o localStorage (não recomendado)
    const permissions = JSON.parse(localStorage.getItem(this.PERMISSIONS_KEY) || '[]');
    return permissions.includes(permission);
  }
  
}
