import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatToolbar } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { EmailPromptRequest } from '../../core/interfaces/Request/EmailPrompt';

@Component({
  selector: 'app-prompt-veritare',
  templateUrl: './prompt-veritare.component.html',
  styleUrls: ['./prompt-veritare.component.css'],
  standalone: true,
  imports: [
    MatToolbar,
    MatFormField,
    FormsModule,
    MatLabel,
    ReactiveFormsModule,
    CommonModule,
    MatError,
    MatButtonModule,
    MatInputModule,
    // Se MatCard, MatCardContent, MatCardTitle forem usados no HTML, adicione-os aqui:
    // MatCard,
    // MatCardContent,
    // MatCardTitle,
  ],
})
export class PromptVeritareComponent implements OnInit {

  form!: FormGroup;
  enviado: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  navigateToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  navigateToAssine() {
    this.router.navigate(['/assine']);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  enviarFormulario() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.enviado = false;
      return;
    }

    // Tipando o valor do formulário com a interface EmailPrompt
    const emailData: EmailPromptRequest = this.form.value;

    console.log('Formulário enviado!', emailData);
    this.enviado = true;
    this.form.reset();

    // Opcional: Aqui você faria a chamada real para um serviço de backend
    // Exemplo usando o tipo EmailPrompt:
    // this.seuServicoDeEnvio.enviarEmail(emailData).subscribe(
    //   response => {
    //     console.log('Sucesso!', response);
    //     this.enviado = true;
    //     this.form.reset();
    //   },
    //   error => {
    //     console.error('Erro ao enviar:', error);
    //     this.enviado = false;
    //     // Poderia mostrar uma mensagem de erro ao usuário aqui
    //   }
    // );
  }
}