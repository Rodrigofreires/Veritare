import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar'; // You can remove MatSnackBar, MatSnackBarConfig if not directly used, as SnackbarService abstracts it.
import { SnackbarService } from '../../services/snackbar.service';
import { finalize } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  selector: 'app-esqueci-minha-senha',
  templateUrl: './esqueci-minha-senha.component.html',
  styleUrls: ['./esqueci-minha-senha.component.css']
})
export class EsqueciMinhaSenhaComponent {
  email: string = '';
  emailTouched = false;
  mensagem: string = '';
  // Adiciona a nova propriedade para controlar o estado de carregamento
  isLoading: boolean = false; // <-- NOVA PROPRIEDADE

  constructor(
    private _loginService: LoginService,
    private _snackBarService: SnackbarService,
    private router: Router
  ) {}

  onBlurEmail() {
    this.emailTouched = true;
  }

  enviarEmail() {
    // Impede o envio se já estiver carregando ou se o email for inválido
    if (this.isLoading || !this.email || !this.email.includes('@')) { // <-- Adiciona verificação isLoading
      if (!this.email || !this.email.includes('@')) {
        this._snackBarService.MostrarErro('Por favor, insira um e-mail válido.');
      }
      return;
    }

    this.isLoading = true; // <-- Define isLoading para true no início da requisição

    this._loginService.enviarEmailRedefinicao(this.email).pipe(
      finalize(() => {
        console.log('Requisição finalizada.');
        this.isLoading = false; // <-- Define isLoading para false após a finalização (sucesso ou erro)
      })
    ).subscribe({
      next: (res) => {
        this._snackBarService.MostrarSucesso('E-mail enviado com sucesso! Redirecionando...');
        setTimeout(() => this.router.navigate(['/login']), 5000);
      },
      error: (err) => {
        console.error('Erro ao enviar e-mail:', err);
        this._snackBarService.MostrarErro('Não foi possível enviar o e-mail. Verifique se ele está digitado corretamente.');
      }
    });
  }
}