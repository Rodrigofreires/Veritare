import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../app/services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class PremiumGuard implements CanActivate {
  constructor(
    private _authService: AuthService,
     private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const tipoPost = route.params['tipoPost']; // Pegamos o tipo do post pela URL
    const isPremiumPost = tipoPost === 'premium'; // Verifica se o post é premium

    // Verifica se o post é premium e se o usuário não tem permissão
    if (isPremiumPost && !this._authService.getUserPermissions().includes('VisualizarPostsPremium')) {
      // Redireciona para a página de notícia, mas com um parâmetro indicando que o post é premium
      this.router.navigate([state.url], { queryParams: { premium: true } });

      // Também pode abrir o modal aqui se preferir
      this._authService.exibirModalNoticiaBloqueada();

      return false; // Impede a navegação para a página premium
    }

    return true; // Permite a navegação se o post não for premium ou se o usuário tiver permissão
  }
}
