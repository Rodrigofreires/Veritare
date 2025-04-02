import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PerfilDeUsuarioRequest } from '../../core/interfaces/Request/PerfilDeUsuario';
import { CommonModule, DatePipe } from '@angular/common';
import { PerfilService } from '../../services/perfil-service';
import { SnackbarService } from '../../services/snackbar.service';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../services/auth.service';
import { ContainerComponent } from "../../shared/container/container.component";
import { MatDialog } from '@angular/material/dialog';
import { ConfirmacaoDialogComponent } from '../../shared/dialogs/confirmacao-dialog.component';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-perfil-de-usuario',
  templateUrl: './perfil-de-usuario.component.html',
  styleUrls: ['./perfil-de-usuario.component.css'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ContainerComponent,
    CommonModule,
  ],

})
export class PerfilDeUsuarioComponent implements OnInit {
  userProfileForm!: FormGroup;
  infosPerfilUsuario: PerfilDeUsuarioRequest | null = null;

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private readonly _perfilService: PerfilService,
    private readonly _snackBarService: SnackbarService,
    private readonly _authService: AuthService,
    private readonly _loginService: LoginService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private router: Router,

    
  ) {}

  ngOnInit(): void {
    
    // Inicializa o formulário
    this.userProfileForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      endereco: ['', Validators.required],
      tipoUsuario: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      tempoAcesso: [0, [Validators.required, Validators.min(0)]],
      acessoPremium: [false],
    });

    const idUsuario = this.obterIdUsuarioDoToken();
    if (idUsuario) {
      this.carregarPerfilDoUsuario(idUsuario);
    } else {
      this._snackBarService.MostrarErro('Não foi possível identificar o usuário.');
    }
  }


  carregarPerfilDoUsuario(idUsuario: number): void {
    this._perfilService.carregarPerfilDoUsuario(idUsuario).subscribe(
      (dados) => {
        this.infosPerfilUsuario = { ...dados }; // Garante uma nova referência no objeto
        this.cdr.detectChanges(); // Garante que o Angular renderize a mudança
      },
      (erro) => {
        this._snackBarService.MostrarErro('Erro ao carregar perfil do usuário.', erro);
      }
    );
  }

  // Função para obter o ID do usuário a partir do token
  private obterIdUsuarioDoToken(): number | null {
    const token = this._authService.getToken();
    if (token) {
      try {
        const decodedToken = jwtDecode<any>(token);
        return Number(decodedToken.IdUsuario) || null;
      } catch (erro) {
        console.error('Erro ao decodificar o token:', erro);
        this._snackBarService.MostrarErro('Erro ao processar token de autenticação.');
        return null;
      }
    } else {
      this._snackBarService.MostrarErro('Token de autenticação não encontrado.');
      return null;
    }
  }

  excluirPerfil(): void {
    const dialogRef = this.dialog.open(ConfirmacaoDialogComponent);
  
    dialogRef.afterClosed().subscribe((confirmado) => {
      if (confirmado) {
        const idUsuario = this.obterIdUsuarioDoToken();
        if (!idUsuario) {
          this._snackBarService.MostrarErro('Usuário não identificado para exclusão.');
          return;
        }
  
        this._perfilService.excluirPerfilDoUsuario(idUsuario).subscribe(
          () => {
            this._snackBarService.MostrarSucesso('Perfil excluído com sucesso.');
            this.infosPerfilUsuario = null;
            this.cdr.markForCheck();
            this._loginService.logout();
  
            // 🔥 Limpa cache antes de redirecionar
            localStorage.clear();
            sessionStorage.clear();
            caches.keys().then((names) => {
              names.forEach((name) => caches.delete(name));
            });
  
            // 🔥 Redireciona sem cache
            this.router.navigate(['home']).then(() => {
              window.location.href = window.location.origin + '/home';
            });
          },
          (erro) => {
            this._snackBarService.MostrarErro('Erro ao excluir perfil do usuário.', erro);
            this.router.navigate(['home']).then(() => {
              window.location.href = window.location.origin + '/home';
            });
          }
        );
      }
    });
  }
  

}
