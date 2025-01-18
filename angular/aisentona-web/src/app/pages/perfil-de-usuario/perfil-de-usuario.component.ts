import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PerfilDeUsuarioRequest } from '../../core/interfaces/Request/PerfilDeUsuario';
import { DatePipe } from '@angular/common';
import { PerfilService } from '../../services/perfil-service';
import { SnackbarService } from '../../services/snackbar.service';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../services/auth.service';
import { ContainerComponent } from "../../shared/container/container.component";

@Component({
  selector: 'app-perfil-de-usuario',
  templateUrl: './perfil-de-usuario.component.html',
  styleUrls: ['./perfil-de-usuario.component.css'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ContainerComponent], // Incluindo DatePipe nos providers
  
})
export class PerfilDeUsuarioComponent implements OnInit {
  userProfileForm!: FormGroup;
  infosPerfilUsuario: PerfilDeUsuarioRequest | null = null;


  //   IdUsuario: 0,
  //   Nome: 'Carregando...',
  //   CPF: '000.000.000-00',
  //   Email: 'Carregando...',
  //   Contato: '12345-6789',
  //   TipoDeUsuario: 1,
  //   Endereco: 'Carregando...',
  //   AcessoPremium: false,
  //   TempoDeAcesso: '00/00/0000', // Data inicial
  //   DataDeNascimento: '00/00/0000',
  //   PremiumExpiraEm: null,
  // };

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private readonly _perfilService: PerfilService,
    private readonly _snackBarService: SnackbarService,
    private readonly _authService: AuthService,
    private cdr: ChangeDetectorRef
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
        console.log('Dados carregados do serviço:', dados);
        this.infosPerfilUsuario = { ...dados }; // Garante uma nova referência no objeto
        console.log('Objeto atualizado:', this.infosPerfilUsuario);
        this.cdr.detectChanges(); // Garante que o Angular renderize a mudança
        this.cdr.markForCheck();
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

  // Função para formatar a data no formato 'dia de mês de ano'
  formatDate(date: string): string {
    return (
      this.datePipe
        .transform(new Date(date), 'd MMMM yyyy', 'UTC', 'pt-BR')
        ?.replace(' ', ' de ') ?? ''
    );
  }

}
