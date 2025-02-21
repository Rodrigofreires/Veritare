import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { PlatformService } from "../../services/platform.service"; // Adicionando o PlatformService
import { catchError, throwError } from "rxjs";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.getToken();

    // Clona a requisição para adicionar o cabeçalho Authorization com o token
    const authReq = req.clone({
        setHeaders: {
            Authorization: token ? `Bearer ${token}` : '' // Adiciona o token no formato "Bearer <token>"
        }
    });


    return next(authReq).pipe(
        catchError((err) => {
            // Se ocorrer algum erro (ex: 401 Unauthorized), apenas retorne o erro
            return throwError(() => err);
        })
    );
};
