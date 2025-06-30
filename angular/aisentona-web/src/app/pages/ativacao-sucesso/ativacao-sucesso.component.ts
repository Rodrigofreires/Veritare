import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ativacao-sucesso',
  templateUrl: './ativacao-sucesso.component.html',
  styleUrls: ['./ativacao-sucesso.component.css'],
  standalone: true, // Define o componente como standalone
  
  imports: [
    CommonModule, 
    MatButtonModule,
  ]
})
export class AtivacaoSucessoComponent {

 constructor(private router: Router) { }

  ngOnInit(): void {
    // Lógica de inicialização, se houver
  }

  /**
   * Navega o usuário para a página de Login.
   */
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  /**
   * Navega o usuário para a página Home.
   * Pode ser útil se a home for a página principal após o login.
   */
  navigateToHome(): void {
    this.router.navigate(['/home']); // Ou a rota da sua página inicial
  }
  
}
