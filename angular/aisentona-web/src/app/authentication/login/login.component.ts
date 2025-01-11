import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ContainerComponent } from '../../shared/container/container.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { LoginService } from '../../services/login.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  senha: string = '';
  loginValid: boolean = true;
  emailTouched: boolean = false;
  senhaTouched: boolean = false;
  

  constructor(
    private _loginService: LoginService,
    private router: Router,
    private _snackBarService: SnackbarService,
    
    
    ) {}

  isValid(): boolean {
    return !!this.email && !!this.senha;
  }

  onBlurEmail() {
    this.emailTouched = true;
  }
  
  onBlurSenha() {
    this.senhaTouched = true;
  }

  login(): void {
    if (this.isValid()) {
      this._loginService.login(this.email, this.senha).subscribe({
        next: () => {
          this.router.navigate(['index']);
        },
        error: () => {
          this._snackBarService.MostrarErro("E-mail ou Senha incorretos")
          this.loginValid = false;
        },
      });
    } else {
      this.loginValid = false;
    }
  }

  loginWithGoogle() {
    throw new Error('Method not implemented.');
  }
}
