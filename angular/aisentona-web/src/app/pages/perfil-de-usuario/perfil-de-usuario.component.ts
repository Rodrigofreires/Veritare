import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../../shared/footer/footer.component';
import { ContainerComponent } from '../../shared/container/container.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-perfil-de-usuario',
  imports: [
    FooterComponent, 
    ContainerComponent, 
    MatFormFieldModule, 
    ReactiveFormsModule, 
    MatDatepickerModule, 
    MatNativeDateModule, MatSelectModule, 
    CommonModule, MatSelectModule, MatInputModule,
    MatCardModule, 
    MatButtonModule, 
    MatIconModule
  ],

  templateUrl: './perfil-de-usuario.component.html',
  styleUrl: './perfil-de-usuario.component.css'
})

export class PerfilDeUsuarioComponent implements OnInit {
  userProfileForm!: FormGroup;
  totalPublicacoes: any;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.userProfileForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      endereco: ['', Validators.required],
      tipoUsuario: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.pattern(/\\d{11}/)]],
      tempoAcesso: [0, [Validators.required, Validators.min(0)]],
      acessoPremium: [false]
    });
  }

  onSubmit() {
    if (this.userProfileForm.valid) {
      console.log(this.userProfileForm.value);
    }
  }

  onCancel() {
    this.userProfileForm.reset();
  }
}