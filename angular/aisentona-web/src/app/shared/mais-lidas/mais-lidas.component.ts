import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PostagemRequest } from '../../core/interfaces/Request/Postagem';
import { NoticiaService } from '../../services/noticia-service';
import { NavigationService } from '../../services/navigation.service';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatList, MatListModule } from '@angular/material/list';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatListModule,
  ],
  selector: 'app-mais-lidas',
  templateUrl: './mais-lidas.component.html',
  styleUrls: ['./mais-lidas.component.css']
})
export class MaisLidasComponent implements OnInit {

  maisLidas: PostagemRequest[] = [];

  constructor(
    private _noticiaService: NoticiaService,
    private _navigationService: NavigationService,
    private _route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this._noticiaService.getMaisLidasDaSemana().subscribe({
      next: (res) => this.maisLidas = res,
      error: (err) => console.error('Erro ao buscar mais lidas:', err)
    });
  }

  navegarParaNoticia(postagem: PostagemRequest): void {
    this._noticiaService.buscarListaDeEditorias().subscribe(listaDeEditorias => {
      const categoria = listaDeEditorias.find(editoria => editoria.id === postagem.idCategoria);

      console.log('Mais lida selecionada:', postagem);
      console.log('Editorias disponíveis:', listaDeEditorias);

      if (categoria) {
        this._navigationService.onAbrirNoticia(postagem, categoria);
      } else {
        console.error('Categoria não encontrada para a postagem', {
          idCategoriaBuscado: postagem.idCategoria,
          listaDeEditorias
        });
      }
    });
  }
}
