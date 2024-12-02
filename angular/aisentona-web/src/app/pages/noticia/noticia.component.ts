import { Component } from '@angular/core';
import { ContainerComponent } from "../../shared/container/container.component";
import { FooterComponent } from '../../shared/footer/footer.component';
import { PaginaNoticiaComponent } from "../../shared/pagina-noticia/pagina-noticia.component";

@Component({
  selector: 'app-noticia',
  imports: [ContainerComponent, FooterComponent, PaginaNoticiaComponent],
  templateUrl: './noticia.component.html',
  styleUrl: './noticia.component.css'
})
export class NoticiaComponent {

}
