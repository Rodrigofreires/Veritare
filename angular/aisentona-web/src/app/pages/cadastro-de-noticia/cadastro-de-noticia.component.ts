import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../../shared/footer/footer.component';
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
import { TextoService } from '../../services/texto-service';
import { TextFieldModule } from '@angular/cdk/text-field';

@Component({
  selector: 'app-cadastro-de-noticia',
  imports: [
    FooterComponent,
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
  

  infosPostagem: PostagemResponse = {} as PostagemResponse;


  constructor(
    private _noticiaService: NoticiaService,
    private _snackBarService: SnackbarService,
    private _imagemService: ImagemService,
    private _textoService: TextoService,
  ) {}

  ngOnInit(): void {
    this.carregarEditorias(); // Carrega as editorias ao inicializar o componente
    this.carregarStatus();

    console.log('Editoria Selecionada = ' + this.editoriaSelecionada)

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

  publicarNoticia(): void {
    if (!this.infosPostagem.titulo || !this.infosPostagem.descricao || !this.editoriaSelecionada || !this.statusSelecionado) {
      this._snackBarService.MostrarErro(
        'Preencha todos os campos obrigatórios antes de publicar.'
      );
      return;
    }
  
    this.infosPostagem.idCategoria = this.editoriaSelecionada
    this.infosPostagem.idStatus = this.statusSelecionado;

    // Verifica se a imagem foi selecionada e convertida
    if (!this.infosPostagem.imagem) {
      this._snackBarService.MostrarErro('Por favor, selecione uma imagem para a notícia.');
      return;
    }

    this.infosPostagem.idUsuario = 1010;
  
    console.log('Dados enviados:', this.infosPostagem);
  
    this._noticiaService.criarPostagem(this.infosPostagem).subscribe(
      (response) => {
        this._snackBarService.MostrarSucesso('Notícia salva com sucesso!');
      },
      (error) => {
        console.error('Erro ao publicar notícia:', error);
        this._snackBarService.MostrarErro(
          'Não foi possível publicar a notícia. Verifique os campos preenchidos.'
        );
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
  

  //LÓGICA PARA CAIXA DE TEXTO AUMENTAR

  AumentarCaixaDeTexto(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this._textoService.ajustarAlturaTextarea(textarea);
  }




}
