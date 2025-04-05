import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { ContainerComponent } from "../../shared/container/container.component";
import { BannerComponent } from "../../shared/banner/banner.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { ListaNoticiasComponent } from '../../shared/lista-noticias/lista-noticias.component';
import { WeatherComponent } from "../../shared/weather/weather.component";
import { BannerNoticiasPremiumComponent } from "../../shared/banner-noticias-premium/banner-noticias-premium.component";
import { FaixaAssineVeritareComponent } from "../../shared/faixa-assine-veritare/faixa-assine-veritare.component";
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { YoutubeWidgetViewerComponent } from '../../shared/youtube-widget-viewer/youtube-widget-viewer.component';

@Component({
  selector: 'app-home',
  imports: [
    ContainerComponent, 
    BannerComponent, 
    ListaNoticiasComponent, 
    BannerNoticiasPremiumComponent, 
    FaixaAssineVeritareComponent,
    YoutubeWidgetViewerComponent,
  
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent implements OnInit {

    constructor(
    private _route: ActivatedRoute,
    private router: Router,
  
    ) {}
  
  ngOnInit(): void {
    
  }

    // Método para navegar e forçar o recarregamento da página
    navigateToAssine() {
      this.router.navigate(['/assine']).then(() => {

      });
    }
 
}
