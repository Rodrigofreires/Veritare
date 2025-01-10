import { Component } from '@angular/core';
import { EditoriaComponent } from "../shared/editoria/editoria.component";
import { HeaderComponent } from "../shared/header/header.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [EditoriaComponent, HeaderComponent, RouterModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

}
