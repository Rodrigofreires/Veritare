import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
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
import { MatPaginator } from '@angular/material/paginator';
import { PostagemRequest } from '../../core/interfaces/Request/Postagem';
import { PostagemResponse } from '../../core/interfaces/Response/Postagem';
import { NoticiaService } from '../../services/noticia-service';
import { SnackbarService } from '../../services/snackbar.service';
import { ActivatedRoute, RouterModule , Router } from '@angular/router';
import { ConfirmacaoDialogComponent } from '../../shared/dialogs/confirmacao-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { timeout } from 'rxjs';
import { TwitterService } from '../../services/twitter.service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { EditoriaRequest } from '../../core/interfaces/Request/Editorias';
import { StatusRequest } from '../../core/interfaces/Request/Status';

@Component({
  selector: 'app-painel-de-controle',
  standalone: true,

  providers: [DatePipe, ],
  
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
    private datePipe: DatePipe, 
  ) {}

  listaDeEditorias: EditoriaRequest[] = []; // Variável para armazenar as editorias
  ListaDeStatus: StatusRequest[] = []; // Variável para armazenar os status
  
  tituloProcurado: string = '';
  statusDaPublicacao: number = 0;
  editoriaProcurada: number = 0;
  selectedDate: string | null = null;
  tipoDePublicacao: string[] = ["Publicação Comum", "Publicação Premium"];
  tipoSelecionado: string = ""; // Para armazenar a opção escolhida
  isFiltroAplicado = false; // Flag de controle para saber se os filtros foram aplicados



  // Dados fictícios para a tabela
  infosPostagem: PostagemRequest[] = [
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
      premiumOuComum: true
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
    palavrasRetiradasPorIA: ''
  }


  ngOnInit(): void {
    console.log("Estado do filtro aplicado:", this.isFiltroAplicado);
  
    if (this.isFiltroAplicado) {
      this.aplicarFiltros(); // Se já há um filtro, aplica automaticamente ao carregar a página
    } else {
      this.carregarTodasAsNoticias(); // Caso contrário, carrega todas as notícias
    }
  
    this.carregarEditorias(); 
    this.carregarStatus();
  }

  dataSource = new MatTableDataSource(this.infosPostagem);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  


  displayedColumns: string[] = ['titulo', 'descricao', 'nomeCategoria', 'nomeStatus', 'premiumOuComum',  'dataCriacao', 'actions'];


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
      palavrasRetiradasPorIA: ''
    };
  
    if (
      this.filtroDeBusca.titulo === "" &&
      this.filtroDeBusca.idStatus === 0 &&
      this.filtroDeBusca.idCategoria === 0 &&
      (this.tipoSelecionado === "" || this.tipoSelecionado === null) &&
      this.filtroDeBusca.dataCriacao === null
    ) {
      this.carregarTodasAsNoticias();
    }

    console.log("Filtro de busca aplicado: ", this.filtroDeBusca);
  
    // Definir que os filtros foram aplicados
    this.isFiltroAplicado = true;
  
    this._noticiaService.carregarTodasAsPostagensPorFiltro(this.filtroDeBusca).subscribe({
      next: (response) => {
        console.log("Postagens filtradas carregadas com sucesso:", response);
        
        // Atualiza a lista de postagens e a fonte de dados da tabela
        this.infosPostagem = response;
        this.dataSource.data = this.infosPostagem;
        
        this._snackBarService.MostrarSucesso("Publicações Filtradas Corretamente");
      },
      error: (error) => {
        console.error("Erro ao carregar postagens:", error);
        this._snackBarService.MostrarErro("Erro ao filtrar as publicações. Tente novamente.");
      }
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
    this.carregarTodasAsNoticias();
  }
  

  visualizarNoticia(id: number) {
    if (!id) {
      this._snackBarService.MostrarErro(
        'ID da postagem não encontrado. Não é possível editar.'
      );
      return;
    }
    this._router.navigate(['/noticia/', id]);
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
            this._snackBarService.MostrarErro('Publicação não identificada para exclusão.');
            return;
          }
    
          this._noticiaService.excluirNoticia(idPostagem).subscribe(
            () => {
              this._snackBarService.MostrarSucesso('Publicação excluída com sucesso.');
              this.infosPostagem = [];
              this.cdr.markForCheck();
    
              caches.keys().then((names) => {
                names.forEach((name) => caches.delete(name));
              });
    
              this._router.navigate(['/painel-de-controle']).then(() => {
                window.location.href = window.location.origin + '/painel-de-controle';
              });
            },
            (erro) => {
              this._snackBarService.MostrarErro('Erro ao excluir perfil do usuário.', erro);

            }
          );
        }
      });
    }

carregarTodasAsNoticias(): void {
  this._noticiaService.carregarTodasAsPostagens().subscribe(
    (dados) => {
      console.log(dados);  // Verifique a estrutura do objeto aqui
      this.infosPostagem = dados;
      this.dataSource.data = this.infosPostagem;  // Atualize a fonte de dados da tabela
    },
    (erro) => {
      console.error('Erro ao carregar todas as notícias:', erro);
      this._snackBarService.MostrarErro('Erro ao carregar notícias.', erro);
    }
  );
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
