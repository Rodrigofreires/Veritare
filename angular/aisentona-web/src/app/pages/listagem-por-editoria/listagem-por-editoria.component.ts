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

@Component({
  selector: 'app-listagem-por-editoria',
  imports: [
    ContainerComponent,
    FooterComponent,
    MatCardModule, 
    MatButtonModule, 
    CommonModule,
   
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
      // // Certifica-se de que o idCategoria é válido
      // if (!this.idCategoria || this.idCategoria <= 0) {
      //   console.error('ID da categoria inválido:', this.idCategoria);
      //   this._snackBarService.MostrarErro('Erro: ID da categoria inválido.');
      //   return;
      // }
    
      // Chama o serviço para carregar as notícias por editoria
      this._noticiaService.carregarPostagensPorEditoria(this.idCategoria).subscribe(
        (dados: PostagemRequest[]) => {
          console.log('Dados recebidos:', dados);
          this.noticiasRelacionadas = dados; // Armazena as notícias relacionadas
        },
        (erro) => {
          this._snackBarService.MostrarErro('Erro ao carregar as notícias:', erro);
          console.error('Erro ao carregar as notícias:', erro);
        }
      );
    }
    
    navegarParaNoticia(idPostagem: number): void {
      this.router.navigate(['/noticia', idPostagem]);
    }

    carregarMaisNoticias(): void {
      if (this.quantidadeNoticias < this.noticiasRelacionadas.length) {
        this.quantidadeNoticias += 5; // Incrementa em 5 o número de notícias exibidas
      }
    }
  


}

