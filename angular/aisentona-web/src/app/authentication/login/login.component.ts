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
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    ContainerComponent,
    FooterComponent,
    MatIcon,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
loginWithGoogle() {
throw new Error('Method not implemented.');
}
  user: string = '';
  password: string = '';
  loginValid: boolean = true;

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.user, this.password).subscribe({
      next: () => {
        this.loginValid = true;
        this.router.navigate(['index']);
      },
      error: () => {
        this.loginValid = false;
      },
    });
  }
}
