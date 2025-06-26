import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PostagemRequest } from '../../core/interfaces/Request/Postagem';
import { NoticiaService } from '../../services/noticia-service';
import { SnackbarService } from '../../services/snackbar.service';
import { MatListModule } from '@angular/material/list';
import { QuillEditorComponent, QuillModule } from 'ngx-quill';
import { MatTooltipModule } from '@angular/material/tooltip';
import { YoutubeWidgetViewerComponent } from "../../shared/youtube-widget-viewer/youtube-widget-viewer.component";
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AuthService } from '../../services/auth.service';
import { NavigationService } from '../../services/navigation.service';

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
    MatTooltipModule,
    YoutubeWidgetViewerComponent,
    MatTabsModule,
    MatIconModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './pagina-noticia.component.html',
  styleUrls: ['./pagina-noticia.component.css']
})
export class PaginaNoticiaComponent implements OnInit, AfterViewInit, OnDestroy {

  url: string = window.location.href;
  alertaVisivel = false;
  alertaTexto: string = '';
  posicaoTooltip = { x: 0, y: 0 };
  quantidadeNoticias = 10;

  infosPostagem: PostagemRequest = {
    titulo: '',
    descricao: '',
    conteudo: '',
    idPostagem: 0,
    idCategoria: 0,
    nomeCategoria: '',
    idStatus: 0,
    idUsuario: 0,
    imagem: '',
    textoAlteradoPorIA: '',
    palavrasRetiradasPorIA: '',
    dataCriacao: '',
    premiumOuComum: false,
    alertas: [],
    visualizacoes: 0,
  };
  noticiasRelacionadas: PostagemRequest[] = [];
  isLoggedIn = false;

  @ViewChild('tabGroup') tabGroup: any;

  private analiseTabLoadedOnce = false;

  constructor(
    private _noticiaService: NoticiaService,
    private _navigationService: NavigationService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _authService: AuthService,
    private dialog: MatDialog,
    private _snackBarService: SnackbarService,
    private el: ElementRef,
  ) {
    this.atualizarPosicaoAlerta = this.atualizarPosicaoAlerta.bind(this);
  }

  ngOnInit(): void {
    this.isLoggedIn = this._authService.isLoggedIn() ?? false;
    this._route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.carregaNoticia(id);
        // Garante que o estado do componente seja resetado para a nova notícia
        // mesmo se o componente não for recriado, apenas os parâmetros mudarem.
        this.resetComponentState();
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.tabGroup) {
      this.tabGroup.selectedTabChange.subscribe((event: MatTabChangeEvent) => {
        if (event.index === 1) { // Aba "Análise da Veritare"
          this.tentarAdicionarEventosNosSobrescritos();
        }
      });
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('mousemove', this.atualizarPosicaoAlerta);
  }

  /**
   * Reseta o estado do componente (ex: volta para a primeira aba, redefine flags)
   * para uma nova notícia ser exibida de forma "limpa".
   */
  private resetComponentState(): void {
    this.analiseTabLoadedOnce = false;
    // Volta para a primeira aba (índice 0) para que o usuário sempre comece na "Matéria da Veritare"
    if (this.tabGroup) {
      this.tabGroup.selectedIndex = 0;
    }
    // Outros resets de estado visual ou flags podem ser adicionados aqui
  }

  carregaNoticia(id: string): void {
    if (!id) {
      this._snackBarService.MostrarErro('ID inválido ou ausente na URL');
      return;
    }

    this._noticiaService.buscarPostagemPorId(+id).subscribe(
      (dados) => {
        this.infosPostagem = dados;

        if (this.infosPostagem?.premiumOuComum === true) {
          if (!this._authService.podeVisualizarNoticiaPremium()) {
            this._authService.acessarNoticiaPremium();
            return;
          }
        }

        if (this.infosPostagem?.idCategoria) {
          this.carregaNoticiasRelacionadas();
        }
        
        // Tenta adicionar eventos nos sobrescritos se a aba de análise for a padrão inicial
        // ou se o conteúdo for carregado nela.
        if (this.tabGroup && this.tabGroup.selectedIndex === 1) {
            this.tentarAdicionarEventosNosSobrescritos();
        }
      },
      (erro) => {
        this._snackBarService.MostrarErro('Erro ao carregar a notícia:', erro);
        console.error('Detalhes do erro ao carregar notícia:', erro);
        // Opcional: Em caso de erro, redirecionar para uma página de erro ou home
        // this._router.navigate(['/home']);
      }
    );
  }

  tentarAdicionarEventosNosSobrescritos(attempts = 0): void {
    const maxAttempts = 10;
    const delay = 200 * (attempts + 1);

    if (attempts >= maxAttempts) {
      console.error('Quill editor: Não foi possível adicionar eventos após múltiplas tentativas.');
      return;
    }

    const quillAnaliseElement = this.el.nativeElement.querySelector('mat-tab[label="Análise da Veritare"] quill-view .ql-editor');

    if (quillAnaliseElement && quillAnaliseElement.innerHTML.length > 0) {
      this.adicionarEventosNosSobrescritos();
      this.analiseTabLoadedOnce = true;
    } else {
      setTimeout(() => this.tentarAdicionarEventosNosSobrescritos(attempts + 1), delay);
    }
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
      console.warn('ID da categoria não encontrado para carregar notícias relacionadas.');
      return;
    }

    const pagina = 1;
    const quantidade = 6;

    this._noticiaService.carregarPostagensPorEditoria(this.infosPostagem.idCategoria, pagina, quantidade)
      .subscribe({
        next: (resposta) => {
          this.noticiasRelacionadas = resposta.dados.filter(n => n.idPostagem !== this.infosPostagem.idPostagem);
        },
        error: (erro) => {
          console.error('Erro ao carregar notícias relacionadas:', erro);
          this._snackBarService.MostrarErro('Erro ao carregar notícias relacionadas.');
        }
      });
  }

  acessarEditarNoticia(): boolean {
    return this._authService.acessarEditarNoticia();
  }

  /**
   * Navega para uma notícia relacionada utilizando o NavigationService,
   * e então força a rolagem da página para o topo para dar a percepção de recarregamento.
   */
  navegarParaNoticia(infosPostagem: PostagemRequest): void {
    this._noticiaService.buscarListaDeEditorias().subscribe(listaDeEditorias => {
      const categoria = listaDeEditorias.find(editoria => editoria.id === infosPostagem.idCategoria);
      if (categoria) {
        // Delega a navegação ao NavigationService.
        // Assumimos que o NavigationService já está construindo a URL corretamente
        // (ex: `/noticia/NomeDaCategoria/ID`).
        this._navigationService.onAbrirNoticia(infosPostagem, categoria);

        // Após a navegação (que altera a URL e dispara o ngOnInit para recarregar dados),
        // forçamos a rolagem para o topo para a percepção de "recarregamento".
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Além disso, resetamos o estado do componente (ex: aba selecionada)
        // para que a nova notícia comece na primeira aba, se desejar.
        this.resetComponentState();

      } else {
        console.error('Categoria não encontrada para a postagem');
        this._snackBarService.MostrarErro('Não foi possível encontrar a categoria da notícia.');
      }
    });
  }

  adicionarEventosNosSobrescritos(): void {
    const quillAnaliseElement = this.el.nativeElement.querySelector('mat-tab[label="Análise da Veritare"] quill-view .ql-editor');

    if (quillAnaliseElement) {
      // Remove listeners existentes para evitar duplicação
      const oldSupElements = quillAnaliseElement.querySelectorAll('sup');
      oldSupElements.forEach((element: HTMLElement) => {
        element.removeEventListener('mouseenter', this.mostrarAlerta.bind(this));
        element.removeEventListener('mouseleave', this.esconderAlerta.bind(this));
      });

      // Adiciona novos listeners
      const newSupElements = quillAnaliseElement.querySelectorAll('sup');
      newSupElements.forEach((element: HTMLElement) => {
        element.addEventListener('mouseenter', this.mostrarAlerta.bind(this));
        element.addEventListener('mouseleave', this.esconderAlerta.bind(this));
      });
    }
  }

  mostrarAlerta(event: MouseEvent): void {
    const elementoTexto = (event.target as HTMLElement).innerText;
    const numeroExtraido = this.converterSobrescritoParaNumero(elementoTexto);

    const textoAlerta = this.infosPostagem.alertas.find(alerta =>
      alerta.numeroAlerta === numeroExtraido
    );

    if (textoAlerta) {
      this.alertaTexto = textoAlerta.mensagem;
      this.alertaVisivel = true;
      this.posicaoTooltip = {
        x: event.clientX + 10,
        y: event.clientY - 40,
      };
      window.addEventListener('mousemove', this.atualizarPosicaoAlerta);
    } else {
      this.esconderAlerta();
    }
  }

  atualizarPosicaoAlerta = (event: MouseEvent) => {
    this.posicaoTooltip = {
      x: event.clientX + 10,
      y: event.clientY - 40,
    };
  };

  esconderAlerta(): void {
    this.alertaVisivel = false;
    window.removeEventListener('mousemove', this.atualizarPosicaoAlerta);
  }

  converterSobrescritoParaNumero(sobrescrito: string): number {
    const numero = sobrescrito.replace('[', '').replace(']', '');
    return parseInt(numero, 10) || -1;
  }

  copyLink(): void {
    navigator.clipboard.writeText(this.url).then(() => {
      this._snackBarService.MostrarSucesso('Link copiado com sucesso!');
    }, (err) => {
      this._snackBarService.MostrarErro('Falha ao copiar o link');
    });
  }
}