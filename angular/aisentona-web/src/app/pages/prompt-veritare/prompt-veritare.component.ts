import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatToolbar } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { EmailPromptRequest } from '../../core/interfaces/Request/EmailPrompt'; // Certifique-se de que o caminho está correto
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Para o spinner de carregamento
import { MatCardModule } from '@angular/material/card'; // Adicionado para MatCard se for usar no HTML
import { PromptService } from '../../services/prompt.service';

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
    MatProgressSpinnerModule, // Adicionado para o spinner
    MatCardModule, // Adicionado para MatCard
    // Se MatCardContent, MatCardTitle forem usados no HTML, adicione-os aqui:
    // MatCardContent,
    // MatCardTitle,
  ],
})
export class PromptVeritareComponent implements OnInit {

  form!: FormGroup;
  enviado: boolean = false;
  carregando: boolean = false; // Novo estado para controle de carregamento
  mensagemErro: string = ''; // Novo estado para mensagens de erro
  mensagemSucesso: string = ''; // Nova variável para mensagem de sucesso

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private promptService: PromptService // Injetar o PromptService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      Nome: ['', Validators.required],  // Alterado de 'nome' para 'Nome'
      Email: ['', [Validators.required, Validators.email]] // Alterado de 'email' para 'Email'
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
    // Limpa mensagens anteriores
    this.enviado = false;
    this.mensagemErro = '';
    this.mensagemSucesso = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.carregando = true; // Inicia o estado de carregamento

    const emailData: EmailPromptRequest = this.form.value;

    this.promptService.solicitarPrompt(emailData).subscribe({
      next: (response) => {
        this.carregando = false; // Finaliza o carregamento
        let parsedResponse: any = response;

        // Tenta parsear a resposta se for uma string (caso o Content-Type não seja application/json no backend)
        if (typeof response === 'string') {
          try {
            parsedResponse = JSON.parse(response);
          } catch (e) {
            // Se não for JSON válido, loga um aviso e exibe um erro genérico
            console.warn('Resposta de sucesso não é um JSON válido e veio como string:', response);
            this.mensagemErro = 'Resposta de sucesso em formato inesperado. Tente novamente.';
            return; // Sai da função para não processar mais
          }
        }

        if (parsedResponse && parsedResponse.mensagem) { // Verifica se há uma mensagem de sucesso na resposta JSON
          this.enviado = true;
          this.mensagemSucesso = parsedResponse.mensagem;
          this.form.reset(); // Limpa o formulário
        } else {

          // Caso a API retorne um sucesso sem a propriedade 'mensagem', ou um formato inesperado
          
          this.mensagemErro = 'Resposta de sucesso da API em formato inesperado (sem a propriedade "mensagem"). Tente novamente.';
        }
        console.log('Resposta da API (sucesso):', parsedResponse);
      },
      error: (error) => {
        this.carregando = false; // Finaliza o carregamento
        console.error('Erro completo da requisição:', error); // Loga o objeto de erro completo para depuração

        let parsedError: any = error.error;

        // Tenta parsear error.error se for uma string que parece JSON
        if (typeof error.error === 'string') {
          try {
            parsedError = JSON.parse(error.error);
          } catch (e) {
            // Não é uma string JSON válida, mantém como está
          }
        }

        // Tenta acessar a propriedade 'erro' do objeto de erro retornado pela API ou do parsedError
        if (parsedError && parsedError.erro) {
          this.mensagemErro = parsedError.erro;
        } else if (typeof error.error === 'string') {
          // Fallback se era uma string, mas não JSON com propriedade 'erro'
          this.mensagemErro = error.error;
        } else if (error.message) {
          // Erro de rede ou erro genérico do HttpClient
          this.mensagemErro = `Ocorreu um erro: ${error.message}`;
        } else {
          // Fallback para qualquer outro caso
          this.mensagemErro = 'Não foi possível enviar a solicitação. Tente novamente mais tarde.';
        }
      }
    });
  }
}