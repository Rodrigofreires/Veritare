import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PerfilGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const loggedIn = this.authService.isLoggedIn();
    if (!loggedIn) {
      this.router.navigate(['/login']);
      return false;
    }

    const loggedUserId = this.authService.getUserId(); // ID do usuário logado
    const loggedUserType = this.authService.getTipoUsuario(); // Tipo de usuário logado
    const routeUserId = route.params['id']; // ID da URL

    // Converte os valores para garantir que estamos comparando números
    if (+loggedUserId === +routeUserId || +loggedUserType === 1) {
      return true; // Permissão concedida
    }

    this.router.navigate(['/home']); // Redireciona para home se não tiver acesso
    return false;
  }
}
