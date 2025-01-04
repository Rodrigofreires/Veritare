import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NoticiaService } from '../../services/noticia-service';
import { SnackbarService } from '../../services/snackbar.service';
import { Router } from '@angular/router';
import { PostagemRequest } from '../../core/interfaces/Request/Postagem';
import { ContainerComponent } from "../container/container.component";

@Component({
  selector: 'app-lista-noticias',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule],
  templateUrl: './lista-noticias.component.html',
  styleUrls: ['./lista-noticias.component.css']
})
export class ListaNoticiasComponent implements OnInit {


  noticias = Array.from({ length: 50 }, (_, i) => ({
    title: `Notícia ${i + 1}`,
    subtitle: `Subtítulo da notícia ${i + 1}`,
    content: `Conteúdo detalhado da notícia ${i + 1}.`
  }));

    infosPostagem: PostagemRequest[] = [
      {
        titulo: 'Carregando...',
        descricao: 'Descrição indisponível no momento.',
        conteudo: '',
        idPostagem: 0,
        idCategoria: 0,
        nomeCategoria: 'Categoria Indisponível',
        idStatus: 0,
        idUsuario: 0,
        imagem: '',
        textoAlteradoPorIA: '',
        palavrasRetiradasPorIA: '',
        dataCriacao: '',
      },
    ];

    quantidadeNoticias = 10;

  constructor(
    private _noticiaService: NoticiaService,
    private _snackBarService: SnackbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarUltimasNoticias();
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      this.carregarMaisNoticias();
    }
  }

  carregarMaisNoticias(): void {
    if (this.quantidadeNoticias < this.infosPostagem.length) {
      this.quantidadeNoticias += 5; // Incrementa em 5 o número de notícias exibidas
    }
  }

  carregarUltimasNoticias(): void {

    this._noticiaService.carregarUltimasPostagens().subscribe(
      (dados) => { this.infosPostagem = dados; },
      (erro) => { this._snackBarService.MostrarErro('Erro ao carregar notícias.', erro); }
    );
  }

  navegarParaNoticia(idPostagem: number): void {
    this.router.navigate(['/noticia', idPostagem]);
  }

}
