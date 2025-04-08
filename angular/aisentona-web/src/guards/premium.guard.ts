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
    ): boolean {
      const editoria = route.params['editoria'];
      const tipoPost = route.params['tipoPost'];
      const ano = route.params['ano'];
      const titulo = route.params['titulo'];
      const id = route.params['id'];
    
      // Verifica se todos os parâmetros estão presentes e válidos
      if (!editoria || !tipoPost || !ano || !titulo || !id) {
        // Redireciona para a página de acesso negado
        this.router.navigate(['/acesso-negado']);
        return false;
      }
    
      // Validações específicas (exemplo: formato de ano e id)
      if (isNaN(+ano) || isNaN(+id)) {
        this.router.navigate(['/acesso-negado']); // Ano ou ID inválido
        return false;
      }
    
      // Verifica se o tipoPost é "premium" e valida o acesso
      const isPremium = tipoPost === 'premium';
      if (isPremium && !this._authService.podeVisualizarNoticiaPremium()) {
        this._authService.acessarNoticiaPremium();
        return false;
      }
    
      return true; // Todos os parâmetros estão válidos e o usuário tem permissão
    }
    
}
