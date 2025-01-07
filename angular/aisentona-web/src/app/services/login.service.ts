import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map, catchError } from 'rxjs';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = environment.apiUrl;


  constructor(
    private http: HttpClient,

  ) { }

// Login do usuário
login(cpf: string, password: string): Observable<any> {
  const body = { cpf, password };

  return this.http.post(`${this.apiUrl}/login`, body).pipe(
    map((response: any) => {
      if (response.token) {
        // Salva o token no localStorage
        localStorage.setItem('token', response.token);
      }
      return response;
    }),
    
    catchError((error) => { 
      console.error('Erro ao fazer login:', error);
      throw error;
    })
  );
}




}
