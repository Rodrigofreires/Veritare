import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirmacao-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule], // ✅ Adicionado os módulos necessários
  template: `
    <h2 mat-dialog-title>Confirmação</h2>
    <mat-dialog-content>Tem certeza que deseja excluir a sua conta permanentemente?</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancelar()">Cancelar</button>
      <button mat-button color="warn" (click)="confirmar()">Confirmar</button>
    </mat-dialog-actions>
  `,
})
export class ConfirmacaoDialogComponent {
  constructor(private dialogRef: MatDialogRef<ConfirmacaoDialogComponent>) {}

  cancelar() {
    this.dialogRef.close(false);
  }

  confirmar() {
    this.dialogRef.close(true);
  }
}
