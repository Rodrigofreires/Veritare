import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { PerfilDeUsuarioRequest } from '../../../core/interfaces/Request/PerfilDeUsuario';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { TipoDeUsuarioRequest } from '../../../core/interfaces/Request/TipoDeUsuário';
import { SettingsComponent } from '../../settings/settings.component';

@Component({
  selector: 'app-modal-editar-usuario',
  standalone: true, // Indica que este componente é standalone
  imports: [
    MatDialogModule, 
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatOptionModule, 
    CommonModule,
    MatSelectModule, 
  ],
  templateUrl: './modal-editar-usuario.component.html',
  styleUrls: ['./modal-editar-usuario.component.css']
})


export class ModalEditarUsuarioComponent {

  infosPerfilUsuario: PerfilDeUsuarioRequest;
  ListaDeTiposDeUsuarios: TipoDeUsuarioRequest[] = [];
  premiumComumProcurado: boolean = false;


  constructor(
    public dialogRef: MatDialogRef<ModalEditarUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      infosPerfilUsuario: PerfilDeUsuarioRequest, 
      premiumComumProcurado: boolean,
      ListaDeTiposDeUsuarios: TipoDeUsuarioRequest[] 
    }
  ) {
    this.infosPerfilUsuario = { ...data.infosPerfilUsuario }; 
    this.ListaDeTiposDeUsuarios = data.ListaDeTiposDeUsuarios; // Agora a lista será preenchida corretamente
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  salvarAlteracoes(): void {
    console.log('Dados salvos:', this.infosPerfilUsuario);
    this.dialogRef.close(this.infosPerfilUsuario);
  }
}
