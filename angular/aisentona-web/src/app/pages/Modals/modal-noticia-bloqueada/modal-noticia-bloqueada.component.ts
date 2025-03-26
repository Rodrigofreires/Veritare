import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  selector: 'app-modal-noticia-bloqueada',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
  ],
    
  templateUrl: './modal-noticia-bloqueada.component.html',
  styleUrl: './modal-noticia-bloqueada.component.css'
})
export class ModalNoticiaBloqueadaComponent {
irParaLogin() {
throw new Error('Method not implemented.');
}
tornarSePremium() {
throw new Error('Method not implemented.');
}

  // Se a permissão for atendida, o modal será fechado
  permissaoAtendida = false;

  constructor(
    
    public dialogRef: MatDialogRef<ModalNoticiaBloqueadaComponent>,

    @Inject(MAT_DIALOG_DATA) public data: { permissaoAtendida: boolean }
  ) {}

  ngOnInit() {    

  }

}

