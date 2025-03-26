import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PostagemRequest } from '../core/interfaces/Request/Postagem';
import { PostagemResponse } from '../core/interfaces/Response/Postagem';
import { EditoriaRequest } from '../core/interfaces/Request/Editorias';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root' // Permite que o serviço seja injetado globalmente
})
export class NavigationService {

    public urlGerada: string = ''; // Variável para armazenar a URL gerada

  constructor(
    
    private router: Router,
    private _authService: AuthService,
  
  
  ) {}

  // Função genérica para normalizar o título, removendo acentos e caracteres especiais
  private normalizarTitulo(titulo: string): string {
    return titulo
      .normalize("NFD") // Normaliza o título para remover acentos
      .replace(/[\u0300-\u036f]/g, "") // Remove os acentos
      .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove caracteres especiais não alfanuméricos
      .replace(/\s+/g, '-') // Substitui os espaços por hífens
      .toLowerCase(); // Converte para minúsculas
  }
  
  // Função genérica para navegar, recebendo apenas infosPostagem e categoria
  navegarParaNoticia(infosPostagem: PostagemRequest, categoria: EditoriaRequest): void {
    // Formatação do título
    const tituloFormatado = this.normalizarTitulo(infosPostagem.titulo);

    //Obtendo e formatando o nome da categoria das publicação
    const categoriaFormatada = this.normalizarTitulo(infosPostagem.nomeCategoria);

    // Definindo o tipo de post
    const tipoPost = infosPostagem.premiumOuComum ? 'premium' : 'comum';

    // Obtendo o ano da publicação
    const anoPublicacao = new Date(infosPostagem.dataCriacao).getFullYear();

     // Gera a URL completa
     this.urlGerada = `/noticia/${categoriaFormatada}/${tipoPost}/${anoPublicacao}/${tituloFormatado}/${infosPostagem.idPostagem}`;

    // Navega para a URL correta com os parâmetros desejados
    this.router.navigate([
      '/noticia',
      categoriaFormatada,  // Nome da categoria ao invés de id
      tipoPost,  // 'premium' ou 'comum'
      anoPublicacao,  // Ano da publicação
      tituloFormatado,  // Título formatado para SEO
      infosPostagem.idPostagem  // ID da postagem
    ]);
  }

  onAbrirNoticia(infosPostagem: PostagemRequest, categoria: EditoriaRequest): void {
    if (infosPostagem.premiumOuComum === true) {
      // Caso o usuário não esteja logado, ou não tenha permissão para ver conteúdo premium, bloqueia o acesso
      if (!this._authService.isLoggedIn()) {
        // Navega para a página da notícia (pode exibir o conteúdo bloqueado para não afetar a navegação)
        this.navegarParaNoticia(infosPostagem, categoria);
  
        // Abre o modal após navegar
        setTimeout(() => {
          this._authService.exibirModalNoticiaBloqueada();
        }, 500); // O tempo pode ser ajustado conforme necessário
      } else if (!this._authService.podeVisualizarNoticiaPremium()) {
        // Abre o modal após navegar
        setTimeout(() => {
          this._authService.exibirModalNoticiaBloqueada();
        }, 500);
      } else {
        // Se o usuário está logado e pode visualizar, navega diretamente
        this.navegarParaNoticia(infosPostagem, categoria);
      }
    } else {
      // Para notícias não premium, apenas navega diretamente
      this.navegarParaNoticia(infosPostagem, categoria);
    }
  }
  

    // Novo método para abrir a URL armazenada em uma nova aba do navegador
  abrirEmNovaAba(): void {
    if (this.urlGerada) {
      // Abre a URL em uma nova aba
      window.open(this.urlGerada, '_blank');
    } else {
      console.error('URL não gerada. Navegue primeiro para uma postagem.');
    }
  }
  
}
