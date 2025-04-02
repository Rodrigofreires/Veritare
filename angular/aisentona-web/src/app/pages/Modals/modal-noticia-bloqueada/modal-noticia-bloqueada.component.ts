import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';

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

  permissaoAtendida = false;

  constructor(
    
    public dialogRef: MatDialogRef<ModalNoticiaBloqueadaComponent>,

    private router: Router,

    @Inject(MAT_DIALOG_DATA) public data: { permissaoAtendida: boolean }
  ) {}

  ngOnInit() {    

  }

    // Método para fechar o modal
    closeModal() {
      // Seu código para fechar o modal (ex: setando uma variável de controle)
      const modal = document.getElementById('modal'); // Supondo que o modal tenha id 'modal'
      if (modal) {
        modal.style.display = 'none'; // Alterando o display para ocultar o modal
      }
    }

  // Método para navegar e forçar o recarregamento da página
  navigateToAssine() {
    this.router.navigate(['/assine']).then(() => {
      location.reload(); // Força o recarregamento da página
    });
  }

}

