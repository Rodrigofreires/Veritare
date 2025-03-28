import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { EditoriaRequest } from '../core/interfaces/Request/Editorias';
import { StatusRequest } from '../core/interfaces/Request/Status';
import { PostagemResponse } from '../core/interfaces/Response/Postagem';
import { PostagemRequest } from '../core/interfaces/Request/Postagem';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})


export class NoticiaService {

  private apiUrl = environment.apiUrl;
  private API = 'postagem';


  constructor(
    private http: HttpClient,
    private _authService: AuthService
  
  ) {}

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
  return this.http.post(`${this.apiUrl}/${this.API}/criar-noticia`, postagem);
}

// EDITAR NOTÍCIA JÁ EXISTENTE
editarNoticia(id: number, postagem: PostagemResponse): Observable<PostagemResponse> {
  const url = `${this.apiUrl}/${this.API}/editar/${id}`;
  return this.http.put<PostagemResponse>(url, postagem);
}

  // EXCLUIR (DESATIVAR) NOTÍCIA
  excluirNoticia(idPostagem: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/postagem/ativar-desativar/${idPostagem}`, {
    });
  }


// BUSCAR POSTAGEM POR ID
buscarPostagemPorId(id: number): Observable<PostagemRequest> {
  return this.http.get<PostagemRequest>(`${this.apiUrl}/${this.API}/${id}`);
}

// LISTAR TODAS AS POSTAGENS
carregarTodasAsPostagens(): Observable<PostagemRequest[]> {
  return this.http.get<PostagemRequest[]>(`${this.apiUrl}/${this.API}/listar-postagens`, {
    headers: {
      'Content-Type': 'application/json', // Certifique-se de que o cabeçalho está correto
    }
  });
}
// LISTAR POSTAGENS COM PAGINAÇÃO
carregarPostagensPaginadas(pagina: number, quantidadePorPagina: number): Observable<PostagemRequest[]> {
  return this.http.get<PostagemRequest[]>(`${this.apiUrl}/${this.API}/listar-postagens-paginadas`, {
    params: {
      pagina: pagina.toString(),
      quantidadePorPagina: quantidadePorPagina.toString()
    },
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

// LISTAR TODAS AS POSTAGENS
carregarTodasAsPostagensPorFiltro(filtros: PostagemResponse): Observable<PostagemRequest[]> {
  return this.http.post<PostagemRequest[]>(`${this.apiUrl}/${this.API}/listar-postagens/filtros`, filtros, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

// LISTAR ÚLTIMAS POSTAGENS
carregarUltimasPostagens(): Observable<PostagemRequest[]> {
  return this.http.get<PostagemRequest[]>(`${this.apiUrl}/${this.API}/listar-ultimas-postagens`)

}

carregarUltimasNoticiasPremium(): Observable<PostagemRequest[]> {
  return this.http.get<PostagemRequest[]>(`${this.apiUrl}/${this.API}/listar-ultimas-postagens-premium`)

}

//CARREGAR POSTAGENS POR EDITORIA
carregarPostagensPorEditoria(idEditoria: number): Observable<PostagemRequest[]> {
  return this.http.get<PostagemRequest[]>(`${this.apiUrl}/${this.API}/listar-por-editoria/${idEditoria}`)

}

//DIRECIONAR PARA A ROTA CORRETA DA NOTÍCIA





}
