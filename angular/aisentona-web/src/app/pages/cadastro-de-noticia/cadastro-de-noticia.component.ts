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
  }


  adicionarAlerta(): void {
    if (this.infosPostagem?.alertas && this.infosPostagem.alertas.length < 20) {
      this.infosPostagem.alertas.push({
        numeroAlerta: this.infosPostagem.alertas.length + 1, // Numeração sequencial
        mensagem: '',
      });
    }
  }
  
  
  removerAlerta(index: number): void {
    if (this.infosPostagem?.alertas && this.infosPostagem.alertas.length > 0) {
      this.infosPostagem.alertas.splice(index, 1);
  
      // Atualiza a numeração dos alertas para manter a sequência correta
      this.infosPostagem.alertas.forEach((alerta, i) => {
        alerta.numeroAlerta = i + 1;
      });
    }
  }


  carregarEditorias(): void {
    this._noticiaService.buscarListaDeEditorias().subscribe({
      next: (data) => (this.listaDeEditorias = data),
      error: (error) => console.error('Erro ao carregar editorias:', error)
    });
  }

  carregarStatus(): void {
    this._noticiaService.buscarListaDeStatus().subscribe({
      next: (data) => (this.listaDeStatus = data),
      error: (error) => console.error('Erro ao carregar status:', error)
    });
  }

  publicarNoticia(): void {
    if (!this.validarCamposObrigatorios()) return;
  
    const idUsuarioToken: number = this._authService.getUserId();
    if (!idUsuarioToken) {
      this._snackBarService.MostrarErro('Usuário não autenticado.');
      return;
    }
  
    const novaPostagem: PostagemRequest = {
      ...this.infosPostagem,
      idCategoria: this.editoriaSelecionada ?? 0, // Garante que seja um número
      idStatus: this.statusSelecionado ?? 0, // Garante que seja um número
      premiumOuComum: this.tipoSelecionado.includes('Publicação Premium'),
      idUsuario: idUsuarioToken,
      dataCriacao: this.infosPostagem.dataCriacao ?? new Date().toDateString(),
      nomeCategoria: this.carregarEditorias.name,
      alertas: this.infosPostagem.alertas ?? []
    };
  
    this._noticiaService.criarPostagem(novaPostagem).subscribe({
      next: () => {
        this._snackBarService.MostrarSucesso('Notícia salva com sucesso!');
        this._router.navigate(['/painel-de-controle']);
      },
      error: (error) => {
        console.error('Erro ao publicar notícia:', error);
        this._snackBarService.MostrarErro('Não foi possível publicar a notícia.');
      },
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
