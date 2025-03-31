import { Component, NgModule } from '@angular/core';
import { FooterComponent } from '../../shared/footer/footer.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ContainerComponent } from '../../shared/container/container.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { ColaboradorResponse } from '../../core/interfaces/Response/Colaborador';
import { LoginService } from '../../services/login.service';
import { SnackbarService } from '../../services/snackbar.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { provideNgxMask } from 'ngx-mask';
import { ModalConfirmacaoCadastroComponent } from '../Modals/modal-confirmacao-cadastro/modal-confirmacao-cadastro.component';
import { MatDialog } from '@angular/material/dialog';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-cadastro-usuario',
  imports: [
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    CommonModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,

  ],
  providers: [
    provideNgxMask(), // Configurado corretamente como provedor
  ],
  templateUrl: './cadastro-usuario.component.html',
  styleUrl: './cadastro-usuario.component.css',
  standalone: true,
})
export class CadastroUsuarioComponent {
  infosColaborador: ColaboradorResponse = {} as ColaboradorResponse;

  loginValid: boolean = true;
  emailTouched: boolean = false;
  senhaTouched: boolean = false;
  nomeTouched: boolean = false;
  cpfTouched: boolean = false;
  celularTouched: boolean = false;
  dataNascimentoTouched: boolean = false;
  senhaConfirmacao: string = '';
  cpfInvalido : boolean = false;


  constructor(
    private _loginService: LoginService,
    private router: Router,
    private _snackBarService: SnackbarService,
    private dialog: MatDialog,
    private loadingService: LoadingService,
  ) {}

  isValid(): boolean {
    const emailValido =
      !!this.infosColaborador.Email &&
      !!this.infosColaborador.Email.includes('@');
    const senhaValida =
      !!this.infosColaborador.Senha && this.infosColaborador.Senha.length >= 6;

    return emailValido && senhaValida;
  }

  validarFormulario() {
    // Marca todos os campos como "touched" para exibir os erros
    this.nomeTouched = true;
    this.cpfTouched = true;
    this.emailTouched = true;
    this.senhaTouched = true;
    this.dataNascimentoTouched = true;
    this.celularTouched = true;
  
    // Adicione outras validações específicas, como campos obrigatórios
    const camposObrigatorios = [
      { campo: this.infosColaborador.Nome, nome: 'Nome' },
      { campo: this.infosColaborador.CPF, nome: 'CPF' },
      { campo: this.infosColaborador.Email, nome: 'Email' },
      { campo: this.infosColaborador.Senha, nome: 'Senha' },
      { campo: this.infosColaborador.DataNascimento, nome: 'Data de Nascimento' },
    ];
  
    for (const campo of camposObrigatorios) {
      if (!campo.campo || campo.campo === '') {
        this._snackBarService.MostrarErro(`O campo ${campo.nome} é obrigatório.`);
        return false; // Retorna falso se algum campo estiver inválido
      }
    }
  
    // Validações específicas, como formato de email
    if (this.infosColaborador.Email && !this.infosColaborador.Email.includes('@')) {
      this._snackBarService.MostrarErro('Por favor, insira um email válido.');
      return false;
    }
  
    if (this.cpfInvalido) {
      this._snackBarService.MostrarErro('Por favor, insira um CPF válido.');
      return false;
    }
  
    return true; // Retorna verdadeiro se o formulário estiver válido
  }

  Cadastro(): void {
    if (this.isValid()) {
      this.loadingService.show(); // Mostrar o spinner enquanto o cadastro está sendo realizado
      this._loginService.cadastroDeColaborador(this.infosColaborador).subscribe({
        next: () => {
          this.loadingService.hide(); // Esconder o spinner quando a resposta for recebida
          // Exibir modal após cadastro bem-sucedido
          this.dialog.open(ModalConfirmacaoCadastroComponent, {
            width: '400px',
          });
        },
        error: () => {
          this.loadingService.hide(); // Esconder o spinner em caso de erro
          this._snackBarService.MostrarErro('Preencha os campos corretamente');
          this.loginValid = false;
        },
      });
    } else {
      this.loginValid = false;
    }
  }


  //VALIDADORES DOS CAMPOS DE CADASTRO - POSSIVELMENTE TEREMOS DE TIRAR DAQUI E CRIAR CAMPOS DE VALIDAÇÃO ESPECÍFICOS
  
  formatarCPF(): void {
    let cpf = this.infosColaborador.CPF || '';
  
    // Remove caracteres não numéricos
    cpf = cpf.replace(/\D/g, '');
  
    // Adiciona pontos e traços no formato 000.000.000-00
    if (cpf.length > 3 && cpf.length <= 6) {
      cpf = cpf.replace(/(\d{3})(\d+)/, '$1.$2');
    } else if (cpf.length > 6 && cpf.length <= 9) {
      cpf = cpf.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
    } else if (cpf.length > 9) {
      cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4');
    }
  
    // Atualiza o CPF no ngModel
    this.infosColaborador.CPF = cpf;
  
    // Chama a validação automaticamente ao formatar
    if (cpf.length === 14) {
      this.validarCPF();
    }
  }

  validarCPF(): void {
    const cpf = this.infosColaborador.CPF?.replace(/\D/g, '') || ''; // Remove caracteres não numéricos
  
    // Verifica se o CPF tem exatamente 11 dígitos
    if (cpf.length !== 11) {
      this.cpfInvalido = true;
      return;
    }
  
    // Validação dos dígitos verificadores
    const digitoValido = (cpf: string, pesoInicial: number) => {
      let soma = 0;
      for (let i = 0; i < pesoInicial - 1; i++) {
        soma += parseInt(cpf[i]) * (pesoInicial - i);
      }
      const resto = soma % 11;
      return resto < 2 ? 0 : 11 - resto;
    };
  
    const primeiroDigito = digitoValido(cpf, 10);
    const segundoDigito = digitoValido(cpf, 11);
  
    this.cpfInvalido =
      parseInt(cpf[9]) !== primeiroDigito || parseInt(cpf[10]) !== segundoDigito;
  }

  //FORMATAR CELULAR

  formatarCelular(): void {
    let telefone = this.infosColaborador.Celular || '';
  
    // Remove todos os caracteres não numéricos
    telefone = telefone.replace(/\D/g, '');
  
    // Adiciona formatação (XX) XXXXX-XXXX
    if (telefone.length > 2 && telefone.length <= 7) {
      telefone = telefone.replace(/(\d{2})(\d{1,5})/, '($1) $2');
    } else if (telefone.length > 7) {
      telefone = telefone.replace(/(\d{2})(\d{5})(\d{1,4})/, '($1) $2-$3');
    }
  
    // Atualiza o valor formatado no ngModel
    this.infosColaborador.Celular = telefone;
  }

  
  permitirSomenteNumeros(event: KeyboardEvent): void {
    const charCode = event.charCode || event.keyCode || event.which;
  
    // Permite apenas números (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }


}
