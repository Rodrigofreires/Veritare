import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-lista-noticias',
  imports: [MatCardModule, MatButtonModule, CommonModule],
  templateUrl: './lista-noticias.component.html',
  styleUrls:  ['./lista-noticias.component.css']
})
export class ListaNoticiasComponent {
  noticias = Array.from({ length: 50 }, (_, i) => ({
    title: `Notícia ${i + 1}`,
    subtitle: `Subtítulo da notícia ${i + 1}`,
    content: `Conteúdo detalhado da notícia ${i + 1}.`
  }));
  displayedNoticias = this.noticias.slice(0, 5); // Inicia com 5 notícias.

  loadMore(): void {
    const nextNoticias = this.displayedNoticias.length + 5;
    this.displayedNoticias = this.noticias.slice(0, nextNoticias);
  }
}
