import { Component } from '@angular/core';
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

@Component({
  selector: 'app-listagem-por-editoria',
  imports: [
    ContainerComponent,
    MatCardModule, 
    MatButtonModule, 
    CommonModule,
    FaixaAssineVeritareComponent,
   
    ],

  templateUrl: './listagem-por-editoria.component.html',
  styleUrl: './listagem-por-editoria.component.css'
})
export class ListagemPorEditoriaComponent {


  listaDeEditorias: EditoriaRequest[] = [];
  nomeCategoria: string = '';
  idCategoria: number = 0; 
  infosPostagem: PostagemRequest = {} as PostagemRequest;
  noticiasRelacionadas: PostagemRequest[] = [];
  quantidadeNoticias: number = 10;

    constructor(
      private _route: ActivatedRoute,
      private _noticiaService: NoticiaService,
      private _snackBarService: SnackbarService,
      private _navigationService: NavigationService,
      private router: Router,
    ) {}


    ngOnInit(): void {
      // Captura os parâmetros 'nomeCategoria' e 'idCategoria' da URL
      this._route.params.subscribe((params) => {
        this.nomeCategoria = params['nomeCategoria'];
        this.idCategoria = +params['idCategoria']; // Converte para número
        this.carregaNoticiasRelacionadas(); // Carrega as notícias relacionadas
      });
    }

    carregaNoticiasRelacionadas(): void {
    
      // Chama o serviço para carregar as notícias por editoria
      this._noticiaService.carregarPostagensPorEditoria(this.idCategoria).subscribe(
        (dados: PostagemRequest[]) => {
          this.noticiasRelacionadas = dados; // Armazena as notícias relacionadas
        },
        (erro) => {
          this._snackBarService.MostrarErro('Erro ao carregar as notícias:', erro);
          console.error('Erro ao carregar as notícias:', erro);
        }
      );
    }
    
    navegarParaNoticia(infosPostagem: PostagemRequest): void {
      // Chama o serviço que retorna a lista de editorias
      this._noticiaService.buscarListaDeEditorias().subscribe(listaDeEditorias => {
        // Filtra a categoria pela correspondência do id
        const categoria = listaDeEditorias.find(editoria => editoria.id === infosPostagem.idCategoria);
    
        if (categoria) {
          // Se encontrar a categoria, chama o serviço de navegação
          this._navigationService.navegarParaNoticia(infosPostagem, categoria);
        } else {
          console.error('Categoria não encontrada para a postagem');
        }
      });
    }    

    carregarMaisNoticias(): void {
      if (this.quantidadeNoticias < this.noticiasRelacionadas.length) {
        this.quantidadeNoticias += 5; // Incrementa em 5 o número de notícias exibidas
      }
    }
  


}

