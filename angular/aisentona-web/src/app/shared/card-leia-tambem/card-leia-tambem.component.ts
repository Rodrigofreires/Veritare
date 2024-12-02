import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-card-leia-tambem',
  imports: [MatCardModule, MatButtonModule, RouterModule, CommonModule ],
  templateUrl: './card-leia-tambem.component.html',
  styleUrl: './card-leia-tambem.component.css'
})
export class CardLeiaTambemComponent {
  
  relatedLinks = [
    { title: 'Notícia Relacionada 1', url: 'http://localhost:4200/noticia' },
    { title: 'Notícia Relacionada 2', url: 'http://localhost:4200/noticia' },
    { title: 'Notícia Relacionada 3', url: 'http://localhost:4200/noticia' },
  ];
}
