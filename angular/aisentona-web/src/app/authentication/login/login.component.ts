import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatMomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import { LoginService } from '../../services/login.service';
import { SnackbarService } from '../../services/snackbar.service';
import { LoginRequest } from '../../core/interfaces/Request/Login';

// Configuração de formato de data no padrão pt-BR
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    RouterModule, 
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})

export class LoginComponent {
  loginValid: boolean = true;
  emailTouched: boolean = false;
  senhaTouched: boolean = false;

  loginRequest: LoginRequest = {} as LoginRequest;
  dataNascimento: Date | null = null; // Suporte a DatePicker

  constructor(
    private _loginService: LoginService,
    private router: Router,
    private _snackBarService: SnackbarService
  ) {}

  isValid(): boolean {
    const emailValido = !!this.loginRequest.Email && this.loginRequest.Email.includes('@');
    const senhaValida = !!this.loginRequest.Senha && this.loginRequest.Senha.length >= 6;

    return emailValido && senhaValida;
  }

  onBlurEmail() {
    this.emailTouched = true;
  }

  onBlurSenha() {
    this.senhaTouched = true;
  }

  login(): void {
    // Atualiza os estados de "tocado" para exibir mensagens de erro
    this.emailTouched = true;
    this.senhaTouched = true;
  
    if (this.isValid()) {
      this._loginService.login(this.loginRequest.Email, this.loginRequest.Senha).subscribe({
        next: () => {
          this._snackBarService.MostrarSucesso('Login efetuado com sucesso');
          this.router.navigate(['home']);
        },
        error: () => {
          this._snackBarService.MostrarErro('E-mail ou Senha incorretos');
          this.loginValid = false; // Define o estado de login inválido
        },
      });
    } else {
      this.loginValid = false; // Atualiza o estado para refletir validação falha
    }
  }
  
  loginWithGoogle() {
    console.warn('Método loginWithGoogle ainda não implementado');
  }
}
