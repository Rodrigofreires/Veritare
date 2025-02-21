import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';
import { tap, throwError } from 'rxjs';
import { PlatformService } from './platform.service';




@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'token'; 
  private readonly PERMISSIONS_KEY = 'userPermissions'; // Nome da chave para permissões
  private readonly API = environment


  constructor(
    private http: HttpClient,
    private platformService: PlatformService,


  ) {}

// Verifica se o token existe (usuário está logado)
isLoggedIn(): boolean {
  // Só tenta acessar o localStorage no navegador
  if (this.platformService.isBrowser()) {
    const token = localStorage.getItem('token');
    return !!token; // Retorna true se o token existir
  }
  return false; // Retorna false se não estiver no navegador
}


getToken(): string | null {
  if (!this.platformService.isBrowser()) {
    return null; // Não tenta acessar localStorage no SSR
  }
  return localStorage.getItem('token');
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

    // Método para verificar se o IdTipoUsuario é válido
    podeAccessarPainelDeControle(): boolean {
      const decodedToken = this.getDecodedToken();
      if (!decodedToken) {
        return false;
      }   
      const idTipoUsuario = decodedToken.IdTipoUsuario;
      return idTipoUsuario !== '5' && idTipoUsuario !== '4';
    }

    // Retorna o Tipo usuario
  
    getTipoUsuario(): string[] {
    const decodedToken = this.getDecodedToken();
    return decodedToken?.IdTipoUsuario;
  }

    
  // Retorna o nome do usuário (campo `unique_name`) do token
  getUserName(): string | null {
    const decodedToken = this.getDecodedToken();
    return decodedToken?.unique_name || null; // Extrai o campo `unique_name`
  }

    // Retorna o nome do usuário (campo `unique_name`) do token
    getUserId(): number {
      const decodedToken = this.getDecodedToken();
      return decodedToken?.IdUsuario || null; // Extrai o campo `unique_name`
    }

  // Retorna as permissões do usuário a partir do token
  getUserPermissions(): string[] {
    const decodedToken = this.getDecodedToken();
    return decodedToken?.Permission || [];
  }



  // // Verifica se o usuário possui uma permissão específica
  // hasPermission(permission: string): boolean {
  //   const decodedToken = this.getDecodedToken();
  //   if (decodedToken && decodedToken.permissions) {
  //     return decodedToken.permissions.includes(permission); // Verifica a permissão no token
  //   }

  //   // Alternativamente, verifica em outra chave, como o localStorage (não recomendado)
  //   const permissions = JSON.parse(localStorage.getItem(this.PERMISSIONS_KEY) || '[]');
  //   return permissions.includes(permission);
  // }
  
}
