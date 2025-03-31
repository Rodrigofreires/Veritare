import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';

@Component({
    standalone: true,
    imports: [
      CommonModule,
      FormsModule,
    ],
  selector: 'app-redefinir-senha',
  templateUrl: './redefinir-senha.component.html',
  styleUrls: ['./redefinir-senha.component.css'],
})
export class RedefinirSenhaComponent {
  novaSenha: string = '';
  confirmarSenha: string = '';
  token: string = '';
  novaSenhaTouched = false;
  confirmarSenhaTouched = false;
  mensagem: string = '';

  constructor(
    private _loginService: LoginService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
    });
  }

  onBlurSenha() {
    this.novaSenhaTouched = true;
  }

  onBlurConfirmarSenha() {
    this.confirmarSenhaTouched = true;
  }

  isValid(): boolean {
    return this.novaSenha.length >= 6 && this.novaSenha === this.confirmarSenha;
  }

  redefinirSenha() {
    if (!this.token) {
      this.mensagem = 'Token inválido ou ausente.';
      return;
    }

    this._loginService.redefinirSenha(this.token, this.novaSenha, this.confirmarSenha).subscribe({
      next: (res) => {
        this.mensagem = res;
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err) => {
        this.mensagem = 'Erro ao redefinir a senha. Tente novamente.';
      }
    });
  }
}
