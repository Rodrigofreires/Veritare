import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { EditoriaRequest } from '../core/interfaces/Request/Editorias';
import { StatusRequest } from '../core/interfaces/Request/Status';
import { PostagemResponse } from '../core/interfaces/Response/Postagem';
import { PostagemRequest } from '../core/interfaces/Request/Postagem';

@Injectable({
  providedIn: 'root', // Disponível em toda a aplicação
})


export class NoticiaService {
  private apiUrl = environment.apiUrl;
  private API = 'postagem';

  constructor(private http: HttpClient) {}

  // BUSCAR LISTA DE EDITORIAS 
buscarListaDeEditorias(): Observable<EditoriaRequest[]> {
  return this.http.get<EditoriaRequest[]>(`${this.apiUrl}/${this.API}/listar-editorias`);

}

  // BUSCAR LISTA DE STATUS 
buscarListaDeStatus(): Observable<StatusRequest[]> {
  return this.http.get<StatusRequest[]>(`${this.apiUrl}/${this.API}/listar-status`);

}

// POSTAR NOVA NOTÍCIA 
criarPostagem(postagem: PostagemResponse): Observable<any> {
  return this.http.post(`${this.apiUrl}/postagem`, postagem);
}

// Buscar postagem por ID
buscarPostagemPorId(id: number): Observable<PostagemRequest> {
  return this.http.get<PostagemRequest>(`${this.apiUrl}/${this.API}/${id}`);
}



}
