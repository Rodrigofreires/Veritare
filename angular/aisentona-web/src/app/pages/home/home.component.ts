import { Component } from '@angular/core';
import { ContainerComponent } from "../../shared/container/container.component";
import { BannerComponent } from "../../shared/banner/banner.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { ListaNoticiasComponent } from '../../shared/lista-noticias/lista-noticias.component';
import { CardLeiaTambemComponent } from "../../shared/card-leia-tambem/card-leia-tambem.component";

@Component({
  selector: 'app-home',
  imports: [ContainerComponent, FooterComponent, BannerComponent, ListaNoticiasComponent, CardLeiaTambemComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true
})
export class HomeComponent {
 
}
