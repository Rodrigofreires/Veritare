import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { EditoriaRequest } from '../core/interfaces/Request/Editorias';

@Injectable({
  providedIn: 'root', // Disponível em toda a aplicação
})


export class NoticiaService {
  private apiUrl = environment.apiUrl;
  private API = 'postagem';

  constructor(private http: HttpClient) {}

  // Exemplo de GET
buscarListaDeEditorias(): Observable<EditoriaRequest[]> {
  return this.http.get<EditoriaRequest[]>(`${this.apiUrl}/${this.API}/listar-editorias`);

}

  // Exemplo de PUT
  updateData(endpoint: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${endpoint}`, data);
  }

  // Exemplo de DELETE
  deleteData(endpoint: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${endpoint}`);
  }
}
