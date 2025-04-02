import { Component, CUSTOM_ELEMENTS_SCHEMA, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PostagemRequest } from '../../core/interfaces/Request/Postagem';
import { NoticiaService } from '../../services/noticia-service';
import { SnackbarService } from '../../services/snackbar.service';
import { MatListModule } from '@angular/material/list';
import { QuillModule } from 'ngx-quill';
import { AuthService } from '../../services/auth.service';
import { NavigationService } from '../../services/navigation.service';
import { ModalNoticiaBloqueadaComponent } from '../Modals/modal-noticia-bloqueada/modal-noticia-bloqueada.component';

@Component({
  standalone: true,
  selector: 'app-pagina-noticia',
  imports: [
    MatCardModule,
    MatButtonModule,
    RouterModule,
    CommonModule,
    MatListModule,
    QuillModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './pagina-noticia.component.html',
  styleUrls: ['./pagina-noticia.component.css']
})
export class PaginaNoticiaComponent {

  quantidadeNoticias: number = 10;
  textoSelecionado: string = 'ia'; // Exibe o texto da IA por padrão
  infosPostagem: PostagemRequest = {} as PostagemRequest;
  noticiasRelacionadas: PostagemRequest[] = [];
  isLoggedIn: boolean = false;
  editorOptions = {
    theme: 'snow',
    readOnly: true,
    formats: ['bold', 'italic', 'underline', 'strike', 'link', 'image', 'blockquote', 'code-block']
  };

  constructor(
    private _noticiaService: NoticiaService,
    private _navigationService: NavigationService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _authService: AuthService,
    private dialog: MatDialog,
    private _snackBarService: SnackbarService,
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this._authService.isLoggedIn() ?? false;
    // Subscreve as mudanças na URL
    
    this._route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.carregaNoticia(); // Recarrega a notícia automaticamente com o novo ID
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['routeParam']) {
      this.carregaNoticia(); // Carrega automaticamente quando o parâmetro da URL mudar
    }
  }

  mostrarTexto(opcao: string): void {
    this.textoSelecionado = opcao;
  }

  carregaNoticia(): void {
    const id = this._route.snapshot.paramMap.get('id'); 
    
    if (!id) {
      this._snackBarService.MostrarErro('ID inválido ou ausente na URL');
      return;
    }

    this._noticiaService.buscarPostagemPorId(+id).subscribe(
      (dados) => {
        this.infosPostagem = dados;

        // Verifica se a notícia é premium e se o usuário tem acesso
        if (this.infosPostagem?.premiumOuComum === true) {
          if (!this._authService.podeVisualizarNoticiaPremium()) {
            this._authService.acessarNoticiaPremium();
            return;
          }
        }

        // Carrega notícias relacionadas, se existir a categoria
        if (this.infosPostagem?.idCategoria) {
          this.carregaNoticiasRelacionadas();
        }
      },
      (erro) => {
        this._snackBarService.MostrarErro('Erro ao carregar a notícia:', erro);
      }
    );
  }

  editarNoticia(): void {
    const id = this._route.snapshot.paramMap.get('id');
    if (!id) {
      this._snackBarService.MostrarErro('ID da postagem não encontrado.');
      return;
    }
    this._router.navigate([`/editar-noticia/${id}`]);
  }

  carregaNoticiasRelacionadas(): void {
    if (!this.infosPostagem?.idCategoria) {
      console.warn('ID da categoria não encontrado. Não é possível carregar notícias relacionadas.');
      return;
    }

    this._noticiaService.carregarPostagensPorEditoria(this.infosPostagem.idCategoria).subscribe(
      (dados) => {
        this.noticiasRelacionadas = dados;
      },
      (erro) => {
        this._snackBarService.MostrarErro('Erro ao carregar as notícias relacionadas:', erro);
      }
    );
  }

  acessarEditarNoticia(): boolean {
    return this._authService.acessarEditarNoticia(); // Somente usuários com permissões adequadas podem editar
  }

  navegarParaNoticia(infosPostagem: PostagemRequest): void {
    this._noticiaService.buscarListaDeEditorias().subscribe(listaDeEditorias => {
      const categoria = listaDeEditorias.find(editoria => editoria.id === infosPostagem.idCategoria);
      if (categoria) {
        this._navigationService.onAbrirNoticia(infosPostagem, categoria);
      } else {
        console.error('Categoria não encontrada para a postagem');
      }
    });
  }
}
