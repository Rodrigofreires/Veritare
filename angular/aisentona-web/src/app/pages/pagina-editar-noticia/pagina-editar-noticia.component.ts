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
import { QuillModule, } from 'ngx-quill';
import { MatIconModule } from '@angular/material/icon'; // Importe MatIconModule para os ícones de remover

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
    MatIconModule, // Adicione MatIconModule aqui
  ],
  selector: 'app-pagina-editar-noticia',
  templateUrl: './pagina-editar-noticia.component.html',
  styleUrls: ['./pagina-editar-noticia.component.css']
})
export class PaginaEditarNoticiaComponent implements OnInit {
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
    alertas: [], // Inicialize alertas como um array vazio
    visualizacoes: 0,
  };

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

  ) { }

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
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
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

  // Métodos para adicionar e remover alertas (copiados do CadastroDeNoticiaComponent)
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
        this.tipoSelecionado = postagem.premiumOuComum ? 'Publicação Premium' : 'Publicação Comum';
        this.infosPostagem.alertas = postagem.alertas || []; // Garante que alertas seja um array vazio se vier nulo

        // Processa o conteúdo para incluir as tags
        // O processamento deve ser feito nos dados que você recebe, antes de atribuir ao ngModel
        this.infosPostagem.conteudo = this.processarConteudoComTags(postagem.conteudo);
        this.infosPostagem.textoAlteradoPorIA = this.processarConteudoComTags(postagem.textoAlteradoPorIA);
        this.infosPostagem.palavrasRetiradasPorIA = this.processarConteudoComTags(postagem.palavrasRetiradasPorIA);
      },
      (error) => {
        this._snackBarService.MostrarErro('Erro ao carregar a notícia.', error);
      }
    );
  }


  processarConteudoComTags(conteudo: string | null | undefined): string { // Alterado de void para string
    // Verifica se há as tags específicas e as converte para o formato correto.
    if (conteudo) {
      // Substitui as tags [[<span>]] por tags HTML válidas para o Quill
      conteudo = conteudo.replace(/\[\[(.*?)\]\]/g, (match, p1) => {
        return `<span style="color:red; font-weight:bold">${p1}</span>`;
      });
    }
    return conteudo || ''; // Retorna o conteúdo processado ou uma string vazia se for nulo/indefinido
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

    // Atualiza as informações da postagem de forma imutável
    const novaPostagem: PostagemRequest = {
      ...this.infosPostagem,
      idCategoria: this.editoriaSelecionada,
      idStatus: this.statusSelecionado,
      idPostagem: +idPostagem,
      imagem: this.imagemBase64,
      premiumOuComum: this.tipoSelecionado.includes('Publicação Premium'),
      alertas: this.infosPostagem.alertas || [], // Inclua a lista de alertas
      dataCriacao: this.infosPostagem.dataCriacao ?? new Date().toDateString(), // Adicionado para garantir o campo
      nomeCategoria: '', // Este campo provavelmente precisa ser preenchido com o nome da categoria selecionada, não 'carregarEditorias.name'
    };

    // Envia a requisição para editar a postagem
    this._noticiaService.editarNoticia(novaPostagem.idPostagem, novaPostagem).subscribe(
      () => {
        this._snackBarService.MostrarSucesso('Notícia editada com sucesso!');
        this._router.navigate(['/painel-de-controle']);
      },
      (error) => {
        console.error('Erro ao salvar edição:', error);
        this._snackBarService.MostrarErro(
          'Erro ao salvar edição. Verifique os dados.'
        );
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
        this.infosPostagem.imagem = this.imagemBase64; // Atualiza a imagem na infosPostagem também
      };
      reader.readAsDataURL(file);
    }
  }
}