import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import { EditoriaRequest } from '../../core/interfaces/Request/Editorias';
import { NoticiaComponent } from '../../pages/noticia/noticia.component';
import { NoticiaService } from '../../services/noticia-service';


@Component({
  selector: 'app-editoria',
  imports: [MatToolbarModule, MatButtonModule],
  templateUrl: './editoria.component.html',
  styleUrl: './editoria.component.css'
})
export class EditoriaComponent {

  constructor(
    private _noticiaService: NoticiaService,

  ) {}

  listaDeEditorias: EditoriaRequest[] = []

  carregarEditorias(): void {
    this._noticiaService.buscarListaDeEditorias().subscribe(
      (data) => {
        this.listaDeEditorias = data; // Atribui os dados retornados pela API
      },
      (error) => {
        console.error('Erro ao carregar editorias:', error);
      }
    );
  }


}
