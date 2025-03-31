import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  selector: 'app-esqueci-minha-senha',
  templateUrl: './esqueci-minha-senha.component.html',
  styleUrls: ['./esqueci-minha-senha.component.css']
})
export class EsqueciMinhaSenhaComponent {
  email: string = '';
  emailTouched = false;
  mensagem: string = '';

  constructor(private _loginService: LoginService) {}

  onBlurEmail() {
    this.emailTouched = true;
  }

  enviarEmail() {
    if (!this.email || !this.email.includes('@')) {
      this.mensagem = 'Por favor, insira um e-mail válido.';
      return;
    }
  
    this._loginService.enviarEmailRedefinicao(this.email).subscribe({
      next: () => this.mensagem = 'Um link de redefinição foi enviado para seu e-mail.',
      error: (err) => {
        console.error('Erro ao enviar e-mail:', err);
        this.mensagem = 'Erro ao enviar o e-mail. Tente novamente.';
      }
    });
  }
}  
