// src/app/main-layout/main-layout.component.ts
import { Component, ViewChild } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router'; // <-- ADICIONE RouterModule AQUI!
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/header/header.component'; // Ajuste o caminho para seu HeaderComponent

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,   
    HeaderComponent,
    MatSidenavModule,
    MatListModule,
    CommonModule,
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  @ViewChild('headerRef') headerRef!: HeaderComponent;
}