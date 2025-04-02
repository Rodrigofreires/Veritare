import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PostagemRequest } from '../core/interfaces/Request/Postagem';
import { EditoriaRequest } from '../core/interfaces/Request/Editorias';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root' // Permite que o serviço seja injetado globalmente
})
export class NavigationService {

  public urlGerada: string = ''; // Variável para armazenar a URL gerada

  constructor(
    private router: Router,
    private _authService: AuthService
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
  
  // Função genérica para gerar a URL
  gerarUrlNoticia(infosPostagem: PostagemRequest, categoria: EditoriaRequest): string {
    const tituloFormatado = this.normalizarTitulo(infosPostagem.titulo);
    const categoriaFormatada = this.normalizarTitulo(infosPostagem.nomeCategoria);
    const tipoPost = infosPostagem.premiumOuComum ? 'premium' : 'comum';
    const anoPublicacao = new Date(infosPostagem.dataCriacao).getFullYear();

    // Gera a URL completa
    return `/noticia/${categoriaFormatada}/${tipoPost}/${anoPublicacao}/${tituloFormatado}/${infosPostagem.idPostagem}`;
  }

  // Função para navegar para a notícia
  navegarParaNoticia(infosPostagem: PostagemRequest, categoria: EditoriaRequest): void {
    // Gera a URL usando o método que já extrai todas as informações necessárias
    const urlGerada = this.gerarUrlNoticia(infosPostagem, categoria);

    // Atualiza a URL gerada
    this.urlGerada = urlGerada;

    // Força a navegação para a URL gerada, sem alterar o histórico
    this.router.navigateByUrl(urlGerada, { replaceUrl: true }).then(() => {
      // Garantir que o componente seja recarregado forçando uma segunda navegação
      this.router.navigate([urlGerada]);  // Isso força o Angular a recarregar a rota
    });
  }

  // Método para abrir a URL gerada em uma nova aba
  abrirEmNovaAba(): void {
    if (this.urlGerada) {
      // Abre a URL em uma nova aba
      window.open(this.urlGerada, '_blank');
    } else {
      console.error('URL não gerada. Navegue primeiro para uma postagem.');
    }
  }

  // Método para abrir a notícia, verificando as permissões do usuário
  onAbrirNoticia(infosPostagem: PostagemRequest, categoria: EditoriaRequest): void {
    if (infosPostagem.premiumOuComum === true) {
      // Caso o usuário não esteja logado ou não tenha permissão para ver conteúdo premium, bloqueia o acesso
      if (!this._authService.isLoggedIn()) {
        this.navegarParaNoticia(infosPostagem, categoria);
        setTimeout(() => this._authService.exibirModalNoticiaBloqueada(), 500);
      } else if (!this._authService.podeVisualizarNoticiaPremium()) {
        setTimeout(() => this._authService.exibirModalNoticiaBloqueada(), 500);
      } else {
        this.navegarParaNoticia(infosPostagem, categoria);
      }
    } else {
      // Para notícias não premium, apenas navega diretamente
      this.navegarParaNoticia(infosPostagem, categoria);
    }
  }
}
