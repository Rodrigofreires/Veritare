import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { ContainerComponent } from "../../shared/container/container.component";
import { BannerComponent } from "../../shared/banner/banner.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { ListaNoticiasComponent } from '../../shared/lista-noticias/lista-noticias.component';
import { WeatherComponent } from "../../shared/weather/weather.component";

@Component({
  selector: 'app-home',
  imports: [ContainerComponent, BannerComponent, ListaNoticiasComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent implements OnInit {
  
  ngOnInit(): void {
    
  }
 
}
