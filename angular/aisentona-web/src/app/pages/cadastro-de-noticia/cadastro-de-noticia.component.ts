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
import { ContentChange, QuillModule } from 'ngx-quill';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

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
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    TextFieldModule,
    QuillModule,
  ],
  providers: [
    
  ],


  templateUrl: './cadastro-de-noticia.component.html',
  styleUrls: ['./cadastro-de-noticia.component.css'],
})
export class CadastroDeNoticiaComponent {
  listaDeEditorias: EditoriaRequest[] = []; // Variável para armazenar as editorias
  ListaDeStatus: StatusRequest[] = []; // Variável para armazenar os status
  editoriaSelecionada: number = 0;
  statusSelecionado: number = 0;
  imagemBase64: string = '';
  tipoDePublicacao: string[] = ['Publicação Comum', 'Publicação Premium'];
  tipoSelecionado: string = ''; // Para armazenar a opção escolhida
  infosPostagem: PostagemResponse = {} as PostagemResponse;

  constructor(
    private _noticiaService: NoticiaService,
    private _snackBarService: SnackbarService,
    private _imagemService: ImagemService,
    private _authService: AuthService,
    private _router: Router, 
  ) {}

  ngOnInit(): void {
    this.carregarEditorias();
    this.carregarStatus();

  }

  carregarEditorias(): void {
    this._noticiaService.buscarListaDeEditorias().subscribe(
      (data) => {
        this.listaDeEditorias = data; // Atribui os dados retornados pela API
      },
      (error) => {
        console.error('Erro ao carregar editorias:', error);
      }
    );
  }

  carregarStatus(): void {
    this._noticiaService.buscarListaDeStatus().subscribe(
      (data) => {
        this.ListaDeStatus = data; // Atribui os dados retornados pela API
      },
      (error) => {
        console.error('Erro ao carregar editorias:', error);
      }
    );
  }

  //MÉTODO PARA PUBLICAR NOTÍCIA
  public publicarNoticia(): void {
    if (
      !this.infosPostagem.titulo ||
      !this.infosPostagem.descricao ||
      !this.editoriaSelecionada ||
      !this.statusSelecionado
    ) {
      this._snackBarService.MostrarErro(
        'Preencha todos os campos obrigatórios antes de publicar.'
      );
      return;
    }
  
    const idUsuarioToken: number = this._authService.getUserId();
    if (!idUsuarioToken) {
      this._snackBarService.MostrarErro('Usuário não autenticado.');
      return;
    }
  
    this.infosPostagem.idCategoria = this.editoriaSelecionada;
    this.infosPostagem.idStatus = this.statusSelecionado;
    this.infosPostagem.premiumOuComum =
      this.tipoSelecionado.includes('Publicação Premium');
    this.infosPostagem.idUsuario = idUsuarioToken;
  
    // Verifica se a imagem foi selecionada e convertida
    if (!this.infosPostagem.imagem) {
      this._snackBarService.MostrarErro(
        'Por favor, selecione uma imagem para a notícia.'
      );
      return;
    }
  
    // Envia a requisição para criar a postagem
    this._noticiaService.criarPostagem(this.infosPostagem).subscribe(
      (response) => {
        this._snackBarService.MostrarSucesso('Notícia salva com sucesso!');
        this._router.navigate(['/painel-de-controle']);

      },
      (error) => {
        console.error('Erro ao publicar notícia:', error);
        this._snackBarService.MostrarErro(
          'Não foi possível publicar a notícia. Verifique os campos preenchidos.'
        );
        console.log(this.infosPostagem);
      }
    );
  }
  
  
  //LÓGICA PARA INSERIR IMAGENS

  abrirSeletorDeArquivo(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  selecionarImagem(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validação do arquivo
      this._imagemService.validarArquivo(file);

      // Conversão para Base64
      const reader = new FileReader();
      reader.onload = () => {
        this.imagemBase64 = reader.result as string;
        this.infosPostagem.imagem = this.imagemBase64;
      };
      reader.readAsDataURL(file);
    }
  }
}
