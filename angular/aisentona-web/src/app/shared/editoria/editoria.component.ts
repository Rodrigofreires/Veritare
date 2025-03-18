import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import { EditoriaRequest } from '../../core/interfaces/Request/Editorias';
import { NoticiaService } from '../../services/noticia-service';
import { SnackbarService } from '../../services/snackbar.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-editoria',
  imports: [
    MatToolbarModule, 
    MatButtonModule,
  CommonModule,
  
  ],

  templateUrl: './editoria.component.html',
  styleUrl: './editoria.component.css'
})



export class EditoriaComponent {


  listaDeEditorias: EditoriaRequest[] = []
  idEditoria: number | null = null;
  noticiasRelacionadas: any[] = [];
  

  constructor(
    private _noticiaService: NoticiaService,
    private _snackBarService: SnackbarService,
    private router: Router

  ) {}


  ngOnInit(): void {
    this.carregarEditorias();
  }


 carregarEditorias(): void {
    this._noticiaService.buscarListaDeEditorias().subscribe(
      (data) => {
        this.listaDeEditorias = data;
      },
      (error) => {
        console.error('Erro ao carregar editorias:', error);
      }
    );
  }

  selecionarEditoria(id: number, nomeCategoria: string): void {
    this.idEditoria = id;
    this.carregarNoticiasPorEditoria(nomeCategoria);
  }

  carregarNoticiasPorEditoria(nomeCategoria: string): void {
    if (this.idEditoria === null) {
      console.error('Nenhuma editoria foi selecionada.');
      return;
    }

    this._noticiaService.carregarPostagensPorEditoria(this.idEditoria).subscribe(
      (dados) => {
        this.noticiasRelacionadas = dados;

        // Redireciona para a rota específica
        this.router.navigate(['/lista-noticia', nomeCategoria, this.idEditoria]);
      },
      (erro) => {
        this._snackBarService.MostrarErro('Erro ao carregar as notícias')
        console.error('Erro ao carregar as notícias:', erro);
        });
      }

  }
