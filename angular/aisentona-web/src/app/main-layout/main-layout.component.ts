import { Component } from '@angular/core';
import { EditoriaComponent } from "../shared/editoria/editoria.component";
import { HeaderComponent } from "../shared/header/header.component";
import { RouterModule } from '@angular/router';
import { FooterComponent } from "../shared/footer/footer.component";
import { FaixaAssineVeritareComponent } from '../shared/faixa-assine-veritare/faixa-assine-veritare.component';

@Component({
  selector: 'app-main-layout',
  imports: [EditoriaComponent, HeaderComponent, RouterModule, FooterComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

}
