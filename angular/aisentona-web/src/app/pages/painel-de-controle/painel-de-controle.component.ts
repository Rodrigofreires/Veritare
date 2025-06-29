import { AfterViewInit, ChangeDetectorRef, Component, ViewChild, } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { PostagemRequest } from '../../core/interfaces/Request/Postagem';
import { NoticiaService } from '../../services/noticia-service';
import { SnackbarService } from '../../services/snackbar.service';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ConfirmacaoDialogComponent } from '../../shared/dialogs/confirmacao-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TwitterService } from '../../services/twitter.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { EditoriaRequest } from '../../core/interfaces/Request/Editorias';
import { StatusRequest } from '../../core/interfaces/Request/Status';
import { PostagemResponse } from '../../core/interfaces/Response/Postagem';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-painel-de-controle',
  standalone: true,

  providers: [DatePipe],

  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatCheckboxModule,
    MatDividerModule,
    FormsModule,
    CommonModule,
    MatPaginator,
    RouterModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DatePipe,
    MatPaginatorModule,
    MatTooltipModule,
  ],
  templateUrl: './painel-de-controle.component.html',
  styleUrls: ['./painel-de-controle.component.css'],
})
export class PainelDeControleComponent implements AfterViewInit {
  constructor(
    private _noticiaService: NoticiaService,
    private _snackBarService: SnackbarService,
    private _twitterService: TwitterService,
    private _route: ActivatedRoute,
    private _router: Router,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private datePipe: DatePipe
  ) {}

  listaDeEditorias: EditoriaRequest[] = []; // Variável para armazenar as editorias
  ListaDeStatus: StatusRequest[] = []; // Variável para armazenar os status

  tituloProcurado: string = '';
  statusDaPublicacao: number = 0;
  editoriaProcurada: number = 0;
  selectedDate: string | null = null;
  tipoDePublicacao: string[] = ['Publicação Comum', 'Publicação Premium'];
  tipoSelecionado: string = ''; // Para armazenar a opção escolhida
  isFiltroAplicado = false; // Flag de controle para saber se os filtros foram aplicados

  totalDePostagens: number = 0; // Total de postagens retornadas pela API
  quantidadeExibida: number = 10;
  paginaAtual: number = 1;
  quantidadePorPagina: number = 10;
  carregandoMais: boolean = false;
  
  // Dados fictícios para a tabela
  infosTodasAsPostagem: PostagemRequest[] = [
    {
      titulo: 'Carregando...',
      descricao: 'Descrição indisponível no momento.',
      conteudo: '',
      idPostagem: 0,
      idCategoria: 0,
      nomeCategoria: 'Categoria Indisponível',
      idStatus: 0,
      idUsuario: 0,
      imagem: '',
      textoAlteradoPorIA: '',
      palavrasRetiradasPorIA: '',
      dataCriacao: '',
      nomeStatus: '',
      premiumOuComum: true,
      alertas: [],
      visualizacoes: 0,  
    },
  ];

  postagensExibidas: PostagemRequest[] = [
    {
      titulo: 'Carregando...',
      descricao: 'Descrição indisponível no momento.',
      conteudo: '',
      idPostagem: 0,
      idCategoria: 0,
      nomeCategoria: 'Categoria Indisponível',
      idStatus: 0,
      idUsuario: 0,
      imagem: '',
      textoAlteradoPorIA: '',
      palavrasRetiradasPorIA: '',
      dataCriacao: '',
      nomeStatus: '',
      premiumOuComum: true,
      alertas: [],
      visualizacoes: 0, 
    },
  ];

  filtroDeBusca: PostagemResponse = {
    titulo: this.tituloProcurado,
    idStatus: this.statusDaPublicacao,
    idCategoria: this.editoriaProcurada,
    premiumOuComum: false,
    dataCriacao: this.selectedDate,
    descricao: '',
    conteudo: '',
    idPostagem: 0,
    idUsuario: 0,
    imagem: '',
    textoAlteradoPorIA: '',
    palavrasRetiradasPorIA: '',
    alertas: [],
      visualizacoes: 0,  
  };

  ngOnInit(): void {
    console.log('Estado do filtro aplicado:', this.isFiltroAplicado);
  
    this.carregarEditorias();
    this.carregarStatus();
  
    // Define valores iniciais
    this.paginaAtual = 1;
    this.quantidadePorPagina = 10;
  
    if (this.isFiltroAplicado) {
      this.aplicarFiltros();
    } else {
      this.carregarMaisPostagens(); // já usa a lógica da paginação
    }
  }
  


  dataSource = new MatTableDataSource(this.infosTodasAsPostagem);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  

  displayedColumns: string[] = [
    'titulo',
    'descricao',
    'nomeCategoria',
    'nomeStatus',
    'premiumOuComum',
    'dataCriacao',
    'actions',
  ];

  aplicarFiltros() {
    this.filtroDeBusca = {
      titulo: this.tituloProcurado,
      idStatus: this.statusDaPublicacao,
      idCategoria: this.editoriaProcurada,
      premiumOuComum: this.tipoSelecionado,
      dataCriacao: this.selectedDate,
      descricao: '',
      conteudo: '',
      idPostagem: 0,
      idUsuario: 0,
      imagem: '',
      textoAlteradoPorIA: '',
      palavrasRetiradasPorIA: '',
      alertas: [],
      visualizacoes: 0,  
    };

    if (
      this.filtroDeBusca.titulo === '' &&
      this.filtroDeBusca.idStatus === 0 &&
      this.filtroDeBusca.idCategoria === 0 &&
      (this.tipoSelecionado === '' || this.tipoSelecionado === null) &&
      this.filtroDeBusca.dataCriacao === null
    ) {
      this.carregarPrimeirasPostagens();
    }

    console.log('Filtro de busca aplicado: ', this.filtroDeBusca);

    // Definir que os filtros foram aplicados
    this.isFiltroAplicado = true;

    this._noticiaService
    .carregarTodasAsPostagensPorFiltro(this.filtroDeBusca)
    .subscribe({
      next: (response) => {
        console.log('Postagens filtradas carregadas com sucesso:', response);
        
        // Atualiza a lista de postagens e a fonte de dados da tabela
        this.infosTodasAsPostagem = response;
        this.dataSource.data = this.infosTodasAsPostagem;
  
        this._snackBarService.MostrarSucesso(
          'Publicações Filtradas Corretamente'
        );
      },
      error: (error) => {
        console.error('Erro ao carregar postagens:', error);
        this._snackBarService.MostrarErro(
          'Erro ao filtrar as publicações. Tente novamente.'
        );
      },
    });
  }

  resetarFiltros() {
    // Resetando as variáveis associadas aos mat-select
    this.tituloProcurado = '';
    this.statusDaPublicacao = 0;
    this.editoriaProcurada = 0;
    this.selectedDate = null;
    this.tipoSelecionado = '';

    // Resetando a flag de filtro aplicado
    this.isFiltroAplicado = false;

    // Se o 'mat-select' usa o 'ngModel', o valor será resetado automaticamente
    // Não há necessidade de resetar manualmente o mat-select. Isso é feito com a atualização dos valores acima.

    // Carregar todas as postagens novamente sem filtros
    this.carregarPrimeirasPostagens();
  }

  visualizarNoticia(id: number) {
    if (!id) {
      this._snackBarService.MostrarErro(
        'ID da postagem não encontrado. Não é possível editar.'
      );
      return;
    }
  
    // Buscar a postagem com base no ID
    const postagem = this.infosTodasAsPostagem.find(post => post.idPostagem === id);
  
    if (!postagem) {
      this._snackBarService.MostrarErro(
        'Postagem não encontrada.'
      );
      return;
    }
  
    // Preparar os parâmetros da rota
    const editoria = postagem.nomeCategoria; // Supondo que 'nomeCategoria' é a editoria
    const tipoPost = postagem.premiumOuComum ? 'premium' : 'comum'; // Exemplo de tipo de publicação
    const ano = new Date(postagem.dataCriacao).getFullYear(); // Extrair o ano da data de criação
    const titulo = postagem.titulo.split(' ').join('-'); // Substituir espaços por hífens no título
  
    // Navegar para a rota com os parâmetros
    this._router.navigate([`noticia/${editoria}/${tipoPost}/${ano}/${titulo}/`, id]);
  }
  

  editarNoticia(id: number): void {
    if (!id) {
      this._snackBarService.MostrarErro(
        'ID da postagem não encontrado. Não é possível editar.'
      );
      return;
    }
    this._router.navigate(['/editar-noticia/', id]);
  }

  excluirNoticia(idPostagem: number): void {
    const dialogRef = this.dialog.open(ConfirmacaoDialogComponent);

    dialogRef.afterClosed().subscribe((confirmado) => {
      if (confirmado) {
        if (!idPostagem) {
          this._snackBarService.MostrarErro(
            'Publicação não identificada para exclusão.'
          );
          return;
        }

        this._noticiaService.excluirNoticia(idPostagem).subscribe(
          () => {
            this._snackBarService.MostrarSucesso(
              'Publicação excluída com sucesso.'
            );
            this.infosTodasAsPostagem = [];
            this.cdr.markForCheck();

            caches.keys().then((names) => {
              names.forEach((name) => caches.delete(name));
            });

            this._router.navigate(['/painel-de-controle']).then(() => {
              window.location.href =
                window.location.origin + '/painel-de-controle';
            });
          },
          (erro) => {
            this._snackBarService.MostrarErro(
              'Erro ao excluir perfil do usuário.',
              erro
            );
          }
        );
      }
    });
  }

  // Método para carregar as primeiras postagens
  carregarPrimeirasPostagens(): void {
    this._noticiaService
      .carregarPostagensPaginadas(this.paginaAtual, this.quantidadePorPagina)
      .subscribe(
        (resposta) => {
          this.totalDePostagens = resposta.total;
          this.infosTodasAsPostagem = resposta.dados;
          this.postagensExibidas = resposta.dados.slice(0, this.quantidadeExibida); // se estiver usando paginação manual
  
          this._snackBarService.MostrarSucesso('Postagens carregadas com sucesso.');
        },
        (erro) => {
          console.error('Erro ao carregar postagens:', erro);
          this._snackBarService.MostrarErro(
            'Erro ao carregar postagens.',
            erro
          );
        }
      );
  }
  

  // Método para carregar mais postagens
  carregarMaisPostagens(): void {
    if (this.carregandoMais) return;
  
    this.carregandoMais = true;
  
    this._noticiaService.carregarPostagensPaginadas(this.paginaAtual, this.quantidadePorPagina)
      .subscribe(
        (resposta) => {
          this.totalDePostagens = resposta.total;
          this.infosTodasAsPostagem = resposta.dados;
          this.postagensExibidas = resposta.dados;
  
          this.carregandoMais = false;
        },
        (erro) => {
          console.error('Erro ao carregar mais postagens:', erro);
          this.carregandoMais = false;
        }
      );
  }
  

  aoMudarPagina(event: PageEvent) {
    this.quantidadePorPagina = event.pageSize;
    this.paginaAtual = event.pageIndex + 1; // O Angular começa do 0
    this.carregarMaisPostagens();
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
}
