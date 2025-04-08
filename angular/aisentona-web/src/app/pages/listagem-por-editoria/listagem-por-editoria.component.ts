import { Component, OnInit } from '@angular/core';
import { ContainerComponent } from "../../shared/container/container.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { ListaNoticiasComponent } from "../../shared/lista-noticias/lista-noticias.component";
import { ImagemService } from '../../services/imagem-service';
import { NoticiaService } from '../../services/noticia-service';
import { SnackbarService } from '../../services/snackbar.service';
import { TextoService } from '../../services/texto-service';
import { EditoriaRequest } from '../../core/interfaces/Request/Editorias';
import { ActivatedRoute, Router } from '@angular/router';
import { PostagemRequest } from '../../core/interfaces/Request/Postagem';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FaixaAssineVeritareComponent } from '../../shared/faixa-assine-veritare/faixa-assine-veritare.component';
import { NavigationService } from '../../services/navigation.service';
import { YoutubeWidgetViewerComponent } from "../../shared/youtube-widget-viewer/youtube-widget-viewer.component";

@Component({
  selector: 'app-listagem-por-editoria',
  imports: [
    ContainerComponent,
    MatCardModule,
    MatButtonModule,
    CommonModule,
    FaixaAssineVeritareComponent,
    YoutubeWidgetViewerComponent,
],

  templateUrl: './listagem-por-editoria.component.html',
  styleUrl: './listagem-por-editoria.component.css'
})
export class ListagemPorEditoriaComponent implements 



OnInit {
  listaDeEditorias: EditoriaRequest[] = [];
  nomeCategoria: string = '';
  idCategoria: number = 0;
  infosPostagem: PostagemRequest = {} as PostagemRequest;

  noticiasRelacionadas: PostagemRequest[] = [];
  paginaAtual: number = 1;
  quantidadePorPagina: number = 10;
  totalDeNoticias: number = 0;
  carregandoMais: boolean = false;

  constructor(
    private _route: ActivatedRoute,
    private _noticiaService: NoticiaService,
    private _snackBarService: SnackbarService,
    private _navigationService: NavigationService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.nomeCategoria = params['nomeCategoria'];
      this.idCategoria = +params['idCategoria'];
      this.paginaAtual = 1;
      this.noticiasRelacionadas = [];
      this.carregarPrimeirasNoticias();
    });
  }

  carregarPrimeirasNoticias(): void {
    this._noticiaService.carregarPostagensPorEditoria(this.idCategoria, this.paginaAtual, this.quantidadePorPagina)
      .subscribe(
        (res) => {
          this.noticiasRelacionadas = res.dados;
          this.totalDeNoticias = res.total;
        },
        (erro) => {
          this._snackBarService.MostrarErro('Erro ao carregar as notícias:', erro);
          console.error('Erro ao carregar as notícias:', erro);
        }
      );
  }

  carregarMaisNoticias(): void {
    if (this.carregandoMais || this.noticiasRelacionadas.length >= this.totalDeNoticias) return;

    this.carregandoMais = true;
    this.paginaAtual++;

    this._noticiaService.carregarPostagensPorEditoria(this.idCategoria, this.paginaAtual, this.quantidadePorPagina)
      .subscribe(
        (res) => {
          this.noticiasRelacionadas = [...this.noticiasRelacionadas, ...res.dados];
          this.carregandoMais = false;
        },
        (erro) => {
          console.error('Erro ao carregar mais notícias:', erro);
          this.carregandoMais = false;
        }
      );
  }

  navegarParaNoticia(infosPostagem: PostagemRequest): void {
    this._noticiaService.buscarListaDeEditorias().subscribe(listaDeEditorias => {
      const categoria = listaDeEditorias.find(editoria => editoria.id === infosPostagem.idCategoria);
      if (categoria) {
        this._navigationService.navegarParaNoticia(infosPostagem, categoria);
      } else {
        console.error('Categoria não encontrada para a postagem');
      }
    });
  }
}



