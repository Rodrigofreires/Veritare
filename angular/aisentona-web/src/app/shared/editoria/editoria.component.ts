import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { EditoriaRequest } from '../../core/interfaces/Request/Editorias';
import { NoticiaService } from '../../services/noticia-service';
import { SnackbarService } from '../../services/snackbar.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PostagensPaginadas } from '../../core/interfaces/Model/PostagensPaginadas';
import { PostagemRequest } from '../../core/interfaces/Request/Postagem';

@Component({
  selector: 'app-editoria',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './editoria.component.html',
  styleUrls: ['./editoria.component.css']
})
export class EditoriaComponent implements OnInit {

  listaDeEditorias: EditoriaRequest[] = [];
  idEditoria: number | null = null;
  noticiasRelacionadas: PostagemRequest[] = [];

  constructor(
    private _noticiaService: NoticiaService,
    private _snackBarService: SnackbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarEditorias();
  }

  carregarEditorias(): void {
    this._noticiaService.buscarListaDeEditorias().subscribe({
      next: (data) => {
        this.listaDeEditorias = data;
      },
      error: (error) => {
        console.error('Erro ao carregar editorias:', error);
      }
    });
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

    const pagina = 1;
    const quantidade = 6;

    this._noticiaService.carregarPostagensPorEditoria(this.idEditoria, pagina, quantidade).subscribe({
      next: (resposta: PostagensPaginadas) => {
        this.noticiasRelacionadas = resposta.dados;

        // Redirecionar para rota
        this.router.navigate(['/lista-noticia', nomeCategoria, this.idEditoria]);
      },
      error: (erro) => {
        this._snackBarService.MostrarErro('Erro ao carregar as notícias');
        console.error('Erro ao carregar as notícias:', erro);
      }
    });
  }
}
