// src/app/header/header.component.ts
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // **Correto: Precisa disso para <mat-icon>**
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-header',
  standalone: true, // **Certifique-se de que está como standalone: true**
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  userName: string | null = null;
  idUsuario: number | null = null;
  @Output() toggleSidenav = new EventEmitter<void>();

  constructor(
    private _authService: AuthService,
    private _loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Adicione console.log aqui para verificar os valores
    this.isLoggedIn = this._authService.isLoggedIn();
    console.log('HeaderComponent - isLoggedIn:', this.isLoggedIn);
    if (this.isLoggedIn) {
      this.userName = this._authService.getUserName();
      this.idUsuario = this._authService.getUserId();
      console.log('HeaderComponent - userName:', this.userName, 'idUsuario:', this.idUsuario);
    }
    console.log('HeaderComponent - Pode acessar Painel de Controle:', this.acessarPainelDeControle());
  }

  logout(): void {
    this._loginService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  acessarPainelDeControle(): boolean {
    return this._authService.podeAccessarPainelDeControle();
  }

  toggleMobileMenu(): void {
    this.toggleSidenav.emit();
    console.log('Evento toggleSidenav emitido!'); // Verifique se este log aparece no console
  }
}