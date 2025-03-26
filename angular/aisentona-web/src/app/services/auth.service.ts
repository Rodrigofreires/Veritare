import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';
import { PlatformService } from './platform.service';
import { LoginService } from './login.service';
import { ModalNoticiaBloqueadaComponent } from '../pages/Modals/modal-noticia-bloqueada/modal-noticia-bloqueada.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly TOKEN_KEY = 'token';
  private readonly API = environment.apiUrl; // A URL da API é extraída do environment

  constructor(
    private http: HttpClient,
    private platformService: PlatformService,
    private _loginSerivce: LoginService,
    private _dialog: MatDialog,  // Somente MatDialog, não precisa do componente aqui
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

  podeExcluirUsuario(): boolean {
    const decodedToken = this.getDecodedToken();
    if (!decodedToken) {
      return false;
    }
    const idTipoUsuario = decodedToken.IdTipoUsuario;
    return idTipoUsuario !== '1' ;
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
    return decodedToken?.role || [];
  }

  // Método para verificar se o usuário tem permissão para ver conteúdo premium
  podeVisualizarNoticiaPremium(): boolean {
    const decodedToken = this.getDecodedToken();
    if (!decodedToken) {
      return false;
    }
    const userPermissions = decodedToken?.role || [];
    // Verifica se o usuário tem a permissão 'VisualizarPostsPremium'
    return userPermissions.includes('VisualizarPostsPremium');
  }

  // Método para mostrar o modal de conteúdo bloqueado
  exibirModalNoticiaBloqueada(): void {
    // Passa a permissão no modal
    this._dialog.open(ModalNoticiaBloqueadaComponent, {
      width: '400px',
      panelClass: 'premium-modal',
      data: {
        permissaoAtendida: this.podeVisualizarNoticiaPremium(), // Passa a verificação de permissão
      },
    });
  }
  

  acessarNoticiaPremium(): void {
    if (!this.isLoggedIn()) {
      // Usuário não está logado, não permite acesso à notícia premium
      this._dialog.open(ModalNoticiaBloqueadaComponent, {
        panelClass: 'modal-noticia-bloqueada', // Classe personalizada para o modal
      });
      return;
    }

    if (!this.podeVisualizarNoticiaPremium()) {
      // O token existe, mas o usuário não tem permissão para ver o conteúdo premium
      this._dialog.open(ModalNoticiaBloqueadaComponent, {
        panelClass: 'modal-noticia-bloqueada', // Classe personalizada para o modal
      });
    } else {
      // O usuário está logado e tem permissão para visualizar a notícia premium
      console.log("Usuário pode visualizar a notícia premium");
    }
}



}
