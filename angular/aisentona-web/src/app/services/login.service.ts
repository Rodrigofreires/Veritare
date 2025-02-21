import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map, catchError } from 'rxjs';
import { SnackbarService } from './snackbar.service';
import { ColaboradorResponse } from '../core/interfaces/Response/Colaborador';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = environment.apiUrl;


  constructor(
    private http: HttpClient,

  ) { }

// LOGIN DO USUÁRIO
login(Email: string, Senha: string): Observable<any> {
  const body = { Email, Senha };

  return this.http.post(`${this.apiUrl}/login`, body).pipe(
    map((response: any) => {
      if (response.token) {

        window.localStorage.setItem('token', response.token)
        console.log('Tokens salvos com sucesso:', response.token, response.refreshToken);
      } else {
        console.warn(' Nenhum refreshToken retornado pelo backend.');
      }
      return response;
    }),
    
    catchError((error) => { 
      console.error(' Erro ao fazer login:', error);
      throw error;
    })
  );
}


//LOGOUT USUÁRIO
logout(): void {
  const token = localStorage.getItem('token'); // Obtém o token do localStorage

  if (token) {
    // Envia o token para a API de logout
    this.http.post(`${this.apiUrl}/Login/logout`, { token }).subscribe({
      next: () => {
        // Se o logout no backend for bem-sucedido, remova o token
        console.log('Logout realizado com sucesso.');
        localStorage.removeItem('token'); // Remove o token armazenado
        localStorage.removeItem('userPermissions'); // Remova permissões, se armazenadas
        localStorage.removeItem('userName'); // Remova dados adicionais relacionados
      },
    });
  } else {
    console.warn('Nenhum token encontrado para logout.');
  }
}

// CADASTRAR NO USUÁRIO
cadastroDeColaborador(infosColaborador: ColaboradorResponse): Observable<any> {
  return this.http.post(`${this.apiUrl}/colaborador`, infosColaborador);
}


}
