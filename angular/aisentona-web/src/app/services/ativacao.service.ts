import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AtivacaoService {
  private apiUrl = environment.apiUrl

  constructor(private http: HttpClient) {}

  ativarConta(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?token=${token}`);
  }
}
