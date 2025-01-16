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
import { PerfilDeUsuarioRequest } from '../../core/interfaces/Request/PerfilDeUsuario';
import { DatePipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

// Registra a localidade pt-BR
registerLocaleData(localePt);

@Component({
  selector: 'app-perfil-de-usuario',
  imports: [ 
    ContainerComponent, 
    MatFormFieldModule, 
    ReactiveFormsModule, 
    MatDatepickerModule, 
    MatNativeDateModule, 
    MatSelectModule, 
    CommonModule, 
    MatSelectModule, 
    MatInputModule,
    MatCardModule, 
    MatButtonModule, 
    MatIconModule
  ],
  providers: [
    DatePipe, // Adicionando DatePipe no provider
  ],
  templateUrl: './perfil-de-usuario.component.html',
  styleUrls: ['./perfil-de-usuario.component.css']
})
export class PerfilDeUsuarioComponent implements OnInit {
  userProfileForm!: FormGroup;
  totalPublicacoes: any;

  infosPerfilUsuario: PerfilDeUsuarioRequest = {
    IdUsuario: 0,
    Nome: "Carregando...",
    CPF: "000.000.000-00",
    Email: "Carregando...",
    Contato: "12345-6789",
    TipoDeUsuario: 1,
    Endereco: "Carregando...",
    AcessoPremium: false,
    TempoDeAcesso: new Date(), // Data atual
    DataDeNascimento: new Date("1990-01-01"),
    PremiumExpiraEm: null
  };

  constructor(private fb: FormBuilder, private datePipe: DatePipe) {}

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

  // Função para formatar a data no formato 'dia mês ano'
  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'd MMMM yyyy', 'UTC', 'pt-BR')?.replace(' ', ' de ') ?? '';


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
