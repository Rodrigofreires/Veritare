import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  standalone: true,
  selector: 'app-sobre-veritare',
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule,
    MatCardModule,
    MatCardModule,
    MatButtonModule,
    RouterModule,
    CommonModule,
    MatListModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    ],
  templateUrl: './sobre-veritare.component.html',
  styleUrl: './sobre-veritare.component.css'
})
export class SobreVeritareComponent {

  constructor(
  private router: Router,
  private route: ActivatedRoute
  ) 
  {}

  navigateToHome() {
    this.router.navigate(['/home'])
  }

  navigateToAssine() {
    this.router.navigate(['/assine'])
  }

  navigateToSection(section: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      fragment: section
    });

    // Para garantir que o scroll seja suave:
    setTimeout(() => {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);
  }



    // Exibe o botão quando o usuário rolar para baixo
    @HostListener('window:scroll', [])
    onWindowScroll() {
      const scrollPosition = window.scrollY;
      const voltarTopoBtn = document.querySelector('.voltar-topo') as HTMLElement;
      
      if (scrollPosition > 200) {
        voltarTopoBtn.classList.add('show');
      } else {
        voltarTopoBtn.classList.remove('show');
      }
    }
  
    // Função para rolar até o topo suavemente
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

}
