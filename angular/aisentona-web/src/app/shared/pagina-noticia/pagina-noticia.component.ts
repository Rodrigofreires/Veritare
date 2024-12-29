import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { CardLeiaTambemComponent } from "../card-leia-tambem/card-leia-tambem.component";
import { PostagemRequest } from '../../core/interfaces/Request/Postagem';

@Component({
  selector: 'app-pagina-noticia',
  imports: [MatCardModule, MatButtonModule, RouterModule, CommonModule, CardLeiaTambemComponent],
  templateUrl: './pagina-noticia.component.html',
  styleUrl: './pagina-noticia.component.css'
})
export class PaginaNoticiaComponent {

textoSelecionado: string = 'ia'; // Exibe o texto da IA por padrão
infosPostagem: PostagemRequest = {} as PostagemRequest;




  mostrarTexto(opcao: string): void {
    this.textoSelecionado = opcao;
  }


}
  

