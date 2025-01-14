import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router'; // Corrigido: Importação do Router de Angular
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-header',
  standalone: true, // Caso seja um componente autônomo
  imports: [
    MatToolbarModule,
    MatButtonModule,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  userName: string | null = null;

  constructor(
    private _authService: AuthService,
    private _loginService: LoginService,
    private router: Router // Corrigido: Injeção do Router do Angular
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this._authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.userName = this._authService.getUserName(); // Obtém o nome do usuário
    }
  }

  hasPermission(permission: string): boolean {
    return this._authService.hasPermission(permission);
  }

  logout(): void {
    // Chama o serviço de logout para invalidar o token no backend
    this._loginService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/login']); // Redireciona para a página de login
  }
  
}
