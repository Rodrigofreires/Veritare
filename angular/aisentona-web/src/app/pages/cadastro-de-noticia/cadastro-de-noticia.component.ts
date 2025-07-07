import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ContainerComponent } from '../../shared/container/container.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { EditoriaRequest } from '../../core/interfaces/Request/Editorias';
import { NoticiaService } from '../../services/noticia-service';
import { PostagemResponse } from '../../core/interfaces/Response/Postagem';
import { FormsModule } from '@angular/forms';
import { StatusRequest } from '../../core/interfaces/Request/Status';
import { SnackbarService } from '../../services/snackbar.service';
import { ImagemService } from '../../services/imagem-service';
import { TextFieldModule } from '@angular/cdk/text-field';
import { QuillModule } from 'ngx-quill';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { PostagemRequest } from '../../core/interfaces/Request/Postagem';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Importar MatProgressSpinnerModule

@Component({
  selector: 'app-cadastro-de-noticia',
  standalone: true,
  imports: [
    ContainerComponent,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    TextFieldModule,
    QuillModule,
    MatProgressSpinnerModule, // Adicionar MatProgressSpinnerModule aqui
  ],
  templateUrl: './cadastro-de-noticia.component.html',
  styleUrls: ['./cadastro-de-noticia.component.css'],
})
export class CadastroDeNoticiaComponent implements OnInit {
  listaDeEditorias: EditoriaRequest[] = [];
  listaDeStatus: StatusRequest[] = [];
  editoriaSelecionada: number | null = null;
  statusSelecionado: number | null = null;
  imagemBase64: string = '';
  tipoDePublicacao: string[] = ['Publicação Comum', 'Publicação Premium'];
  tipoSelecionado: string = '';

  dataAgendamentoSelecionada: Date | null = null;
  horaAgendamentoSelecionada: string = '';

  mostrarCampoAgendamento: boolean = false;
  isLoading: boolean = false; // Nova propriedade para controlar o spinner

  infosPostagem: PostagemResponse = {
    titulo: '',
    descricao: '',
    conteudo: '',
    idPostagem: 0,
    idCategoria: 0,
    idStatus: 0,
    idUsuario: 0,
    imagem: '',
    textoAlteradoPorIA: '',
    palavrasRetiradasPorIA: '',
    premiumOuComum: '',
    dataCriacao: null,
    alertas: [],
    visualizacoes: 0,
    dataPublicacaoAgendada: null,
  };

  constructor(
    private _noticiaService: NoticiaService,
    private _snackBarService: SnackbarService,
    private _imagemService: ImagemService,
    private _authService: AuthService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.carregarEditorias();
    this.carregarStatus();
    this.definirTextoPadraoFonteMateria();
  }

  definirTextoPadraoFonteMateria(): void {
    if (!this.infosPostagem.palavrasRetiradasPorIA || this.infosPostagem.palavrasRetiradasPorIA.trim() === '') {
      this.infosPostagem.palavrasRetiradasPorIA = `
        <p><strong>NOME DO JORNAL/PORTAL/BLOG ANALISADO</strong></p>
        <p><strong><a href="[INSERIR LINK COMPLETO AQUI]" target="_blank">[LINK DA MATÉRIA ANALISADA]</a></strong></p>
        <br>
        <p><strong>Aviso de direitos autorais</strong></p>
        <p><i>A Veritare realiza apenas a análise da matéria, sem republicá-la integralmente ou reproduzi-la de forma indevida. Nosso objetivo não é copiar ou cometer plágio, mas oferecer uma análise imparcial das informações publicadas.<i></p>
        <p><i>A Veritare examina conteúdos de diversos portais de notícias nacionais e internacionais com a missão de entregar aos usuários informações livres de viés ideológico. Nosso compromisso é com o jornalismo, garantindo que a informação seja clara, objetiva e fundamentada nos fatos.<i></p>
      `;
    }
  }

  adicionarAlerta(): void {
    if (this.infosPostagem?.alertas && this.infosPostagem.alertas.length < 20) {
      this.infosPostagem.alertas.push({
        numeroAlerta: this.infosPostagem.alertas.length + 1,
        mensagem: '',
      });
    }
  }

  removerAlerta(index: number): void {
    if (this.infosPostagem?.alertas && this.infosPostagem.alertas.length > 0) {
      this.infosPostagem.alertas.splice(index, 1);
      this.infosPostagem.alertas.forEach((alerta, i) => {
        alerta.numeroAlerta = i + 1;
      });
    }
  }

  carregarEditorias(): void {
    this._noticiaService.buscarListaDeEditorias().subscribe({
      next: (data) => (this.listaDeEditorias = data),
      error: (error) => console.error('Erro ao carregar editorias:', error),
    });
  }

  carregarStatus(): void {
    this._noticiaService.buscarListaDeStatus().subscribe({
      next: (data) => (this.listaDeStatus = data),
      error: (error) => console.error('Erro ao carregar status:', error),
    });
  }

  onStatusChange(): void {
    this.mostrarCampoAgendamento = this.statusSelecionado === 5;
    if (!this.mostrarCampoAgendamento) {
      this.dataAgendamentoSelecionada = null;
      this.horaAgendamentoSelecionada = '';
    }
  }

  publicarNoticia(): void {
    if (!this.validarCamposObrigatorios()) return;

    this.isLoading = true; // Ativa o spinner

    const idUsuarioToken: number = this._authService.getUserId();
    if (!idUsuarioToken) {
      this._snackBarService.MostrarErro('Usuário não autenticado.');
      this.isLoading = false; // Desativa o spinner em caso de erro
      return;
    }

    let dataHoraAgendada: string | null = null;
    if (this.mostrarCampoAgendamento && this.dataAgendamentoSelecionada && this.horaAgendamentoSelecionada) {
      const data = new Date(this.dataAgendamentoSelecionada);
      const [horas, minutos] = this.horaAgendamentoSelecionada.split(':').map(Number);
      data.setHours(horas, minutos, 0, 0);
      dataHoraAgendada = data.toISOString();
    } else if (this.mostrarCampoAgendamento && (!this.dataAgendamentoSelecionada || !this.horaAgendamentoSelecionada)) {
        this._snackBarService.MostrarErro('Por favor, preencha a data e hora de agendamento.');
        this.isLoading = false; // Desativa o spinner em caso de erro
        return;
    }

    const novaPostagem: PostagemRequest = {
      ...this.infosPostagem,
      idCategoria: this.editoriaSelecionada ?? 0,
      idStatus: this.statusSelecionado ?? 0,
      premiumOuComum: this.tipoSelecionado.includes('Publicação Premium'),
      idUsuario: idUsuarioToken,
      dataCriacao: this.infosPostagem.dataCriacao ?? new Date().toDateString(),
      nomeCategoria: '',
      alertas: this.infosPostagem.alertas ?? [],
      dataPublicacaoAgendada: dataHoraAgendada,
    };

    const subscription = this._noticiaService.criarPostagem(novaPostagem).subscribe({
      next: () => {
        this._snackBarService.MostrarSucesso('Notícia salva com sucesso!');
        this._router.navigate(['/painel-de-controle']);
      },
      error: (error) => {
        console.error('Erro ao publicar notícia:', error);
        this._snackBarService.MostrarErro('Não foi possível publicar a notícia.');
      }
    });
    subscription.add(() => {
      this.isLoading = false; // Desativa o spinner sempre, no sucesso ou no erro
    });
  }

  validarCamposObrigatorios(): boolean {
    if (!this.infosPostagem.titulo?.trim()) {
      this._snackBarService.MostrarErro('O título é obrigatório.');
      return false;
    }
    if (!this.infosPostagem.descricao?.trim()) {
      this._snackBarService.MostrarErro('A descrição é obrigatória.');
      return false;
    }
    if (!this.editoriaSelecionada) {
      this._snackBarService.MostrarErro('Selecione uma editoria.');
      return false;
    }
    if (!this.statusSelecionado) {
      this._snackBarService.MostrarErro('Selecione um status.');
      return false;
    }
    if (!this.imagemBase64) {
      this._snackBarService.MostrarErro('Por favor, selecione uma imagem para a notícia.');
      return false;
    }
    if (this.mostrarCampoAgendamento && (!this.dataAgendamentoSelecionada || !this.horaAgendamentoSelecionada)) {
        this._snackBarService.MostrarErro('Para uma publicação planejada, a data e hora de agendamento são obrigatórias.');
        return false;
    }
    return true;
  }

  abrirSeletorDeArquivo(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput?.click();
  }

  selecionarImagem(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this._imagemService.validarArquivo(file);

      const reader = new FileReader();
      reader.onload = () => {
        this.imagemBase64 = reader.result as string;
        this.infosPostagem.imagem = this.imagemBase64;
      };
      reader.onerror = () => {
        this._snackBarService.MostrarErro('Erro ao carregar a imagem. Tente novamente.');
      };
      reader.readAsDataURL(file);
    }
  }
}