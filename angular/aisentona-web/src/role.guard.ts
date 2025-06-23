import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userPermissions = this.authService.getUserPermissions();
    const userType = this.authService.getTipoUsuario();
    const requiredRoles: string[] = route.data['Permission']; // Permissões exigidas
    const requiredUserTypes: string[] = route.data['IdTipoDeUsuario']; // Tipos de usuário exigidos

    // Se houver permissões necessárias, verifica se o usuário possui alguma delas
    if (requiredRoles && !requiredRoles.some(role => userPermissions.includes(role))) {
      this.router.navigate(['/home']); // Redireciona se não tiver permissão
      return false;
    }

    // Se houver restrição de tipos de usuário, verifica se o usuário tem um dos tipos exigidos
    if (requiredUserTypes && !requiredUserTypes.includes(userType)) {
      this.router.navigate(['/home']); // Redireciona se o tipo de usuário não for permitido
      return false;
    }

    return true;
  }
}
