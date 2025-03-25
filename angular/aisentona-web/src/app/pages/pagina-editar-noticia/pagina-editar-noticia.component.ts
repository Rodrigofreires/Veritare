import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // Para exibir notificações
import { NoticiaService } from '../../services/noticia-service';
import { SnackbarService } from '../../services/snackbar.service';
import { PostagemRequest } from '../../core/interfaces/Request/Postagem';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PostagemResponse } from '../../core/interfaces/Response/Postagem';
import { FooterComponent } from '../../shared/footer/footer.component';
import { ContainerComponent } from "../../shared/container/container.component";
import { EditoriaRequest } from '../../core/interfaces/Request/Editorias';
import { StatusRequest } from '../../core/interfaces/Request/Status';
import { ImagemService } from '../../services/imagem-service';
import { TextoService } from '../../services/texto-service';
import { TextFieldModule } from '@angular/cdk/text-field';
import { QuillModule,  } from 'ngx-quill';


@Component({
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    RouterModule,
    FooterComponent,
    ContainerComponent,
    TextFieldModule,
    QuillModule,

],
  selector: 'app-pagina-editar-noticia',
  templateUrl: './pagina-editar-noticia.component.html',
  styleUrls: ['./pagina-editar-noticia.component.css']
})
export class PaginaEditarNoticiaComponent implements OnInit {
  infosPostagem: PostagemResponse = {} as PostagemResponse;

  listaDeEditorias: EditoriaRequest[] = []; // Variável para armazenar as editorias
  ListaDeStatus: StatusRequest[] = []; // Variável para armazenar os status
  editoriaSelecionada: number = 0;
  statusSelecionado: number = 0;
  imagemBase64: string = '';
  isCodeView: boolean = false;
  tipoSelecionado: string = ''; // Para armazenar a opção escolhida
  tipoDePublicacao: string[] = ['Publicação Comum', 'Publicação Premium'];
  modules: any


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private _noticiaService: NoticiaService,
    private _imagemService: ImagemService,
    private _textoService: TextoService,
    private _snackBarService: SnackbarService,
    private _router: Router

  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregarPostagem(+id);
    }
    this.carregarEditorias();
    this.carregarStatus();

    this.modules = {
      //Framework de edição de texto - comandos para utilização
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'header': [1, 2, 3, false] }],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'align': [] }],
          ['link', 'image', 'video'],
          [{ 'size': ['small', false, 'large', 'huge'] }],
          [{ 'color': [] }, { 'background': [] }],
          ['clean']
        ]
      },
      clipboard: {
        matchVisual: false // Para permitir colar HTML e manter as tags
      }
    };

  }

  toggleCodeView(): void {
    this.isCodeView = !this.isCodeView;
    const editor = document.querySelector('.ql-editor') as HTMLElement;
    if (editor) {
      if (this.isCodeView) {
        const html = editor.innerHTML;
        editor.innerText = html; 
      } else {
        const text = editor.innerText;
        editor.innerHTML = text; 
      }
    }
  }


  carregarEditorias(): void {
    this._noticiaService.buscarListaDeEditorias().subscribe(
      (data) => {
        this.listaDeEditorias = data;
      },
      (error) => {
        console.error('Erro ao carregar editorias:', error);
      }
    );
  }

  carregarStatus(): void {
    this._noticiaService.buscarListaDeStatus().subscribe(
      (data) => {
        this.ListaDeStatus = data;
      },
      (error) => {
        console.error('Erro ao carregar status:', error);
      }
    );
  }

  carregarPostagem(id: number): void {
    this._noticiaService.buscarPostagemPorId(id).subscribe(
      (postagem) => {
        this.infosPostagem = postagem;
        this.editoriaSelecionada = postagem.idCategoria;
        this.statusSelecionado = postagem.idStatus;
        this.imagemBase64 = postagem.imagem;
  

        // Processa o conteúdo para incluir as tags
        this.processarConteudoComTags(postagem.textoAlteradoPorIA);
        this.processarConteudoComTags(postagem.palavrasRetiradasPorIA);
        this.processarConteudoComTags(postagem.conteudo);

        this.infosPostagem.premiumOuComum =
        this.tipoSelecionado.includes('Publicação Premium');

  
        // Adiciona o conteúdo processado ao editor
        const editor = document.querySelector('.ql-editor') as HTMLElement;
        if (editor) {
          editor.innerHTML = postagem.textoAlteradoPorIA; // ou o campo que contém o conteúdo processado
        }
      },
      (error) => {
        this._snackBarService.MostrarErro('Erro ao carregar a notícia.', error);
      }
    );
  }
  

  processarConteudoComTags(conteudo: string): string { // Alterado de void para string
    // Verifica se há as tags específicas e as converte para o formato correto.
    if (conteudo) {
      // Substitui as tags [[<span>]] por tags HTML válidas para o Quill
      conteudo = conteudo.replace(/\[\[(.*?)\]\]/g, (match, p1) => {
        return `<span style="color:red; font-weight:bold">${p1}</span>`;
      });
    }
    return conteudo; // Retorna o conteúdo processado
  }
  
  

  salvarEdicao(): void {
    const idPostagem = this.route.snapshot.paramMap.get('id');
    if (!idPostagem) {
      this._snackBarService.MostrarErro('Erro: ID da notícia não encontrado!');
      return;
    }
  
    if (!this.imagemBase64) {
      this._snackBarService.MostrarErro('Por favor, selecione uma imagem antes de salvar.');
      return;
    }
  
    this.infosPostagem.idCategoria = this.editoriaSelecionada;
    this.infosPostagem.idStatus = this.statusSelecionado;
    this.infosPostagem.idPostagem = +idPostagem;
    this.infosPostagem.imagem = this.imagemBase64;
    this.infosPostagem.premiumOuComum = this.tipoSelecionado
  
    // Aqui você pode adicionar mais lógica, se necessário, para processar o conteúdo antes de salvar
    this._noticiaService.editarNoticia(this.infosPostagem.idPostagem, this.infosPostagem).subscribe(
      () => {
        this._snackBarService.MostrarSucesso('Notícia editada com sucesso!');
        this._router.navigate(['/noticia', this.infosPostagem.idPostagem]);
      },
      (error) => {
        this._snackBarService.MostrarErro('Erro ao salvar edição. Verifique os dados.', error);
      }
    );
  }

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
      this._imagemService.validarArquivo(file);
      const reader = new FileReader();
      reader.onload = () => {
        this.imagemBase64 = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }



}