import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { CardLeiaTambemComponent } from "../card-leia-tambem/card-leia-tambem.component";

@Component({
  selector: 'app-pagina-noticia',
  imports: [MatCardModule, MatButtonModule, RouterModule, CommonModule, CardLeiaTambemComponent],
  templateUrl: './pagina-noticia.component.html',
  styleUrl: './pagina-noticia.component.css'
})
export class PaginaNoticiaComponent {
  title = 'Título da Notícia';
  subtitle = 'Subtítulo da Notícia';
  imageUrl = 'https://via.placeholder.com/800x400';
  content = `
    Este é o corpo do texto da notícia. Aqui você pode inserir um conteúdo dinâmico que será exibido ao usuário.
    Suporta parágrafos longos e estilização customizada.
  `;





}
