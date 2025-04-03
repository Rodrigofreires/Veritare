import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  HostListener,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NoticiaService } from '../../services/noticia-service';
import { SnackbarService } from '../../services/snackbar.service';
import { Router } from '@angular/router';
import { PostagemRequest } from '../../core/interfaces/Request/Postagem';
import { ContainerComponent } from '../container/container.component';
import { WeatherComponent } from '../weather/weather.component';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-lista-noticias',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule, WeatherComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './lista-noticias.component.html',
  styleUrls: ['./lista-noticias.component.css'],
})
export class ListaNoticiasComponent implements OnInit {
  infosUltimasPostagem: PostagemRequest[] = [
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
      nomeStatus: '',
      premiumOuComum: true,
      alertas: [], // Adicionando a propriedade alertas
    },
  ];

  infosTodasAsPostagem: PostagemRequest[] = [
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
      nomeStatus: '',
      premiumOuComum: true,
      alertas: [], // Adicionando a propriedade alertas
    },
  ];

  postagensExibidas: PostagemRequest[] = [
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
      nomeStatus: '',
      premiumOuComum: true,
      alertas: [], // Adicionando a propriedade alertas
      
    },
  ];

  quantidadeExibida: number = 10;
  paginaAtual: number = 1;
  quantidadePorPagina: number = 10;
  carregandoMais: boolean = false;

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

  // Método para carregar as primeiras postagens
  carregarPrimeirasPostagens(): void {
    this._noticiaService
      .carregarPostagensPaginadas(this.paginaAtual, this.quantidadePorPagina)
      .subscribe(
        (dados) => {
          this.infosTodasAsPostagem = dados;
          this.postagensExibidas = this.infosTodasAsPostagem.slice(
            0,
            this.quantidadeExibida
          ); // Atualiza as exibidas
        },
        (erro) => {
          console.error('Erro ao carregar postagens:', erro);
          this._snackBarService.MostrarErro(
            'Erro ao carregar postagens.',
            erro
          );
        }
      );
  }

  // Método para carregar mais postagens
  carregarMaisPostagens(): void {
    if (this.carregandoMais) return; // Evita múltiplas chamadas simultâneas

    this.carregandoMais = true;
    this.paginaAtual++;

    this._noticiaService
      .carregarPostagensPaginadas(this.paginaAtual, this.quantidadePorPagina)
      .subscribe(
        (dados) => {
          if (dados.length > 0) {
            this.infosTodasAsPostagem = [
              ...this.infosTodasAsPostagem,
              ...dados,
            ]; // Adiciona as novas postagens
            this.postagensExibidas = this.infosTodasAsPostagem.slice(
              0,
              this.quantidadeExibida * this.paginaAtual
            ); // Atualiza as exibidas
          }
          this.carregandoMais = false;
        },
        (erro) => {
          console.error('Erro ao carregar mais postagens:', erro);
          this.carregandoMais = false;
        }
      );
  }
  navegarParaNoticia(infosPostagem: PostagemRequest): void {
    // Chama o serviço que retorna a lista de editorias
    this._noticiaService
      .buscarListaDeEditorias()
      .subscribe((listaDeEditorias) => {
        // Filtra a categoria pela correspondência do id
        const categoria = listaDeEditorias.find(
          (editoria) => editoria.id === infosPostagem.idCategoria
        );

        if (categoria) {
          // Se encontrar a categoria, chama o serviço de navegação
          this._navigationService.onAbrirNoticia(infosPostagem, categoria);
        } else {
          console.error('Categoria não encontrada para a postagem');
        }
      });
  }
}
