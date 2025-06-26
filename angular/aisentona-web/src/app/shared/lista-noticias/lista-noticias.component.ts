import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NoticiaService } from '../../services/noticia-service';
import { SnackbarService } from '../../services/snackbar.service';
import { Router, RouterModule } from '@angular/router';
import { PostagemRequest} from '../../core/interfaces/Request/Postagem';
import { WeatherComponent } from '../weather/weather.component';
import { YoutubeWidgetViewerComponent } from '../youtube-widget-viewer/youtube-widget-viewer.component';
import { NavigationService } from '../../services/navigation.service';
import { PostagensPaginadas } from '../../core/interfaces/Model/PostagensPaginadas';
import { MaisLidasComponent } from "../mais-lidas/mais-lidas.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-noticias',
  standalone: true,
  imports: [
    MatCardModule, 
    MatButtonModule, 
    CommonModule,  
    YoutubeWidgetViewerComponent, 
    MaisLidasComponent,
    FormsModule,
    RouterModule,
  
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './lista-noticias.component.html',
  styleUrls: ['./lista-noticias.component.css'],
})
export class ListaNoticiasComponent implements OnInit {
  infosUltimasPostagem: PostagemRequest[] = [];
  infosTodasAsPostagem: PostagemRequest[] = [];
  postagensExibidas: PostagemRequest[] = [];

  quantidadeExibida: number = 10;
  paginaAtual: number = 1;
  quantidadePorPagina: number = 10;
  carregandoMais: boolean = false;
  totalDePostagens: number = 0;

  constructor(
    private _noticiaService: NoticiaService,
    private _snackBarService: SnackbarService,
    private _navigationService: NavigationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarUltimasNoticias();
    this.carregarPrimeirasPostagens();
  }

  carregarUltimasNoticias(): void {
    this._noticiaService.carregarUltimasPostagens().subscribe(
      (dados) => {
        this.infosUltimasPostagem = dados;
      },
      (erro) => {
        this._snackBarService.MostrarErro('Erro ao carregar notícias.', erro);
      }
    );
  }

  carregarPrimeirasPostagens(): void {
    this._noticiaService
      .carregarPostagensPaginadas(this.paginaAtual, this.quantidadePorPagina)
      .subscribe(
        (res: PostagensPaginadas) => {
          this.totalDePostagens = res.total;
          this.infosTodasAsPostagem = res.dados;
          this.postagensExibidas = res.dados.slice(0, this.quantidadeExibida);
        },
        (erro) => {
          console.error('Erro ao carregar postagens:', erro);
          this._snackBarService.MostrarErro('Erro ao carregar postagens.', erro);
        }
      );
  }

  carregarMaisPostagens(): void {
    if (this.carregandoMais) return;

    this.carregandoMais = true;
    this.paginaAtual++;

    this._noticiaService
      .carregarPostagensPaginadas(this.paginaAtual, this.quantidadePorPagina)
      .subscribe(
        (res: PostagensPaginadas) => {
          if (res.dados.length > 0) {
            this.infosTodasAsPostagem = [
              ...this.infosTodasAsPostagem,
              ...res.dados,
            ];
            this.postagensExibidas = this.infosTodasAsPostagem.slice(
              0,
              this.quantidadeExibida * this.paginaAtual
            );
          }
          this.carregandoMais = false;
        },
        (erro) => {
          console.error('Erro ao carregar mais postagens:', erro);
          this.carregandoMais = false;
        }
      );
  }

  navegarParaNoticia(noticia: PostagemRequest): void {
    if (!noticia.idCategoria) {
      console.error('Postagem não tem idCategoria');
      return;
    }
  
    this._noticiaService.buscarListaDeEditorias().subscribe(listaDeEditorias => {
      const categoria = listaDeEditorias.find(editoria => editoria.id === noticia.idCategoria);
      
      if (categoria) {
        const postagemComCategoria: PostagemRequest = {
          ...noticia,
          nomeCategoria: categoria.nome
        };
  
        this._navigationService.navegarParaNoticia(postagemComCategoria, categoria);
      } else {
        console.error('Categoria não encontrada para a postagem');
      }
    });
  }
  
}
