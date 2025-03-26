import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../app/services/auth.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PremiumGuard implements CanActivate {
  constructor(
    private _authService: AuthService,
     private router: Router) {}


     canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ): boolean | Observable<boolean> {
      const isPremium = route.params['tipoPost'] === 'premium';
  
      if (isPremium && !this._authService.podeVisualizarNoticiaPremium()) {
        this._authService.acessarNoticiaPremium();
        return false; // Bloqueia a navegação
      }
  
      return true; // Permite o acesso
    }
}
