import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { PerfilDeUsuarioRequest } from '../../../core/interfaces/Request/PerfilDeUsuario';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { TipoDeUsuarioRequest } from '../../../core/interfaces/Request/TipoDeUsuário';
import { provideNgxMask, NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { DataValidators } from '../../../../data-validators';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { PerfilService } from '../../../services/perfil-service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-modal-editar-usuario',
  standalone: true, // Indica que este componente é standalone
  providers: [DatePipe, provideNgxMask()],
  imports: [
    MatDialogModule, 
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatOptionModule, 
    CommonModule,
    MatSelectModule, 
    MatDatepickerModule, 
  ],
  templateUrl: './modal-editar-usuario.component.html',
  styleUrls: ['./modal-editar-usuario.component.css']
})


export class ModalEditarUsuarioComponent {

  @ViewChild('perfilForm', { static: true }) perfilForm!: NgForm;
  
  perfilSelecionado: PerfilDeUsuarioRequest = {} as PerfilDeUsuarioRequest;
  ListaDeTiposDeUsuarios: TipoDeUsuarioRequest[] = [];
  premiumComumProcurado: boolean = false;
  idUsuario: number = 0;
  usuarioEncontrado: any;

  constructor(  
    private _snackBarService: SnackbarService,
    private _perfilService: PerfilService,
    public _dataValidators: DataValidators,
    public dialogRef: MatDialogRef<ModalEditarUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      perfilSelecionado: PerfilDeUsuarioRequest,
      premiumComumProcurado: boolean,
      ListaDeTiposDeUsuarios: TipoDeUsuarioRequest[],


    }
      ,
  ) {
    this.perfilSelecionado = { ...data.perfilSelecionado }; // Copia o objeto para evitar alterações indesejadas
    this.ListaDeTiposDeUsuarios = data.ListaDeTiposDeUsuarios; 
    this.premiumComumProcurado = data.premiumComumProcurado;

      // Converte o valor de acessoPremium para booleano
    this.perfilSelecionado.acessoPremium = !!this.perfilSelecionado.acessoPremium;
    
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  EditarPerfilDoUsuario(): void {
    // Verifica se o formulário é válido antes de enviar
    if (!this.perfilForm || this.perfilForm.invalid) {
      console.warn('Formulário inválido, verifique os campos!');
      return;
    }
  
    // Criando um objeto atualizado com os dados do formulário
    const perfilAtualizado: PerfilDeUsuarioRequest = { ...this.perfilSelecionado };
    
    console.log('Enviando atualização para o serviço:', perfilAtualizado);
  
    // Chamando o serviço para atualizar os dados
    this._perfilService.atualizarPerfil(perfilAtualizado).subscribe({
      next: () => {
        this._snackBarService.MostrarSucesso('Perfil atualizado com sucesso!');
        this.dialogRef.close(perfilAtualizado); // Fecha o modal e retorna os dados atualizados
      },
      error: (erro) => {
        console.error('Erro ao atualizar o perfil:', erro);
        this._snackBarService.MostrarErro('Não foi possível atualizar o perfil. Tente novamente mais tarde.');
      }
    });
  }
  
  
  

  onInputChange(event: Event, campo: keyof PerfilDeUsuarioRequest): void {
    const inputElement = event.target as HTMLInputElement;
    if (this.perfilSelecionado) {
      // Verifica se o campo é um string e depois formata
      if (typeof this.perfilSelecionado[campo] === 'string') {
        (this.perfilSelecionado[campo] as unknown as string) = DataValidators.formatarCelular(inputElement.value);
      }
    }
  }

  
  somenteNumeros(event: KeyboardEvent): void {
    DataValidators.permitirSomenteNumeros(event);
  }
  
  // debugaaaaaaaaaaaaa(): void {
  //   console.log('ListaDeTiposDeUsuarios:', JSON.stringify(this.ListaDeTiposDeUsuarios, null, 2));
  //   console.log('premiumComumProcurado:', JSON.stringify(this.premiumComumProcurado, null, 2));
  //   console.log('Infos Carregadas:', JSON.stringify(this.perfilSelecionado, null, 2));


}
