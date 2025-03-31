import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-modal-confirmacao-cadastro',
  imports: [
    MatCardModule,
  ],
  templateUrl: './modal-confirmacao-cadastro.component.html',
  styleUrl: './modal-confirmacao-cadastro.component.css'
})
export class ModalConfirmacaoCadastroComponent {
  constructor(
    private dialogRef: MatDialogRef<ModalConfirmacaoCadastroComponent>) {}

    
  fecharModal(): void {
    this.dialogRef.close();
  }
}
