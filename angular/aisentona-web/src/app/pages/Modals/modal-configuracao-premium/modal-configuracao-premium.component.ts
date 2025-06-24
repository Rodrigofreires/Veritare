import { Component, Inject, ViewChild, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { PerfilDeUsuarioRequest } from '../../../core/interfaces/Request/PerfilDeUsuario';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SnackbarService } from '../../../services/snackbar.service';
import { TipoDePlanoPremium } from '../../../core/interfaces/Response/Premium';
import { PremiumService } from '../../../services/premium-service';

@Component({
  selector: 'app-modal-configurar-premium',
  standalone: true,
  providers: [DatePipe],
  imports: [
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatOptionModule,
    CommonModule,
    MatSelectModule,
    MatSlideToggleModule,
  ],
  templateUrl: './modal-configuracao-premium.component.html',
  styleUrls: ['./modal-configuracao-premium.component.css']
})
export class ModalConfigurarPremiumComponent implements OnInit {

  @ViewChild('premiumForm', { static: true }) premiumForm!: NgForm;

  perfilSelecionado!: PerfilDeUsuarioRequest;
  premiumAtivo = false;
  planoPremiumSelecionado: TipoDePlanoPremium = TipoDePlanoPremium.Mensal;

  tiposDePlanoPremium = [
    { id: TipoDePlanoPremium.Mensal, nome: 'Mensal' },
    { id: TipoDePlanoPremium.Semestral, nome: 'Semestral' },
    { id: TipoDePlanoPremium.Anual, nome: 'Anual' }
  ];

  constructor(
    private _snackBarService: SnackbarService,
    private _premiumService: PremiumService,
    public dialogRef: MatDialogRef<ModalConfigurarPremiumComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { perfilSelecionado: any } // aceitaremos camelCase ou PascalCase
  ) {}

  ngOnInit(): void {
    this.perfilSelecionado = this.normalizarPerfil(this.data.perfilSelecionado);
    this.premiumAtivo = !!this.perfilSelecionado.acessoPremium;

    if (this.premiumAtivo && this.perfilSelecionado.IdTipoUsuario) {
      this.planoPremiumSelecionado = this.perfilSelecionado.IdTipoUsuario as TipoDePlanoPremium;
    }

    console.log('Perfil recebido e normalizado:', this.perfilSelecionado);
  }

  private normalizarPerfil(p: any): PerfilDeUsuarioRequest {
    return {
      IdUsuario: p.IdUsuario ?? p.idUsuario ?? 0,
      nome: p.nome ?? '',
      cpf: p.cpf ?? '',
      email: p.email ?? '',
      contato: p.contato ?? '',
      nomeTipoDeUsuario: p.nomeTipoDeUsuario ?? '',
      IdTipoUsuario: p.IdTipoUsuario ?? p.idTipoUsuario ?? 0,
      endereco: p.endereco ?? null,
      acessoPremium: p.acessoPremium ?? false,
      tempoDeAcesso: p.tempoDeAcesso ?? '',
      dataDeNascimento: p.dataDeNascimento ?? '',
      premiumExpiraEm: p.premiumExpiraEm ?? null
    };
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onPremiumToggleChange(): void {
    if (!this.premiumAtivo) {
      this.planoPremiumSelecionado = TipoDePlanoPremium.Mensal;
    }
  }

  ConfigurarPremiumDoUsuario(): void {
    const id = this.perfilSelecionado.IdUsuario;

    if (typeof id !== 'number' || id <= 0) {
      this._snackBarService.MostrarErro('Erro: ID do usuário inválido. Recarregue a página e tente novamente.');
      return;
    }

    if (this.premiumAtivo && (!this.premiumForm?.valid || !this.planoPremiumSelecionado)) {
      this._snackBarService.MostrarErro('Por favor, selecione um plano Premium válido.');
      return;
    }

    const payload = {
      IdUsuario: id,
      idTipoPlanoPremium: this.planoPremiumSelecionado
    };

    console.log('Payload enviado para o backend:', payload);

    const request$ = this.premiumAtivo
      ? this._premiumService.tornarUsuarioPremium(payload)
      : this._premiumService.tirarUsuarioPremium(payload);

    request$.subscribe({
      next: (res: any) => {
        const msg = typeof res === 'string' ? res : (res?.mensagem ?? 'Operação realizada com sucesso!');
        this._snackBarService.MostrarSucesso(msg);
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Erro na operação Premium:', err);
        this._snackBarService.MostrarErro('Ocorreu um erro ao atualizar o status Premium.');
      }
    });
  }
}
