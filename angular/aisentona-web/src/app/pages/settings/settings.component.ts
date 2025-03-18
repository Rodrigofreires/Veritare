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
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { PerfilDeUsuarioRequest } from '../../core/interfaces/Request/PerfilDeUsuario';
import { PerfilService } from '../../services/perfil-service';
import { PerfilDeUsuarioResponse } from '../../core/interfaces/Response/PerfilDeUsuario';

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
  
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

   constructor(
      private _noticiaService: NoticiaService,
      private _snackBarService: SnackbarService,
      private _perfilService: PerfilService,
      private _twitterService: TwitterService,
      private _route: ActivatedRoute,
      private _router: Router,
      private cdr: ChangeDetectorRef,
      private dialog: MatDialog,
      private datePipe: DatePipe, 
    ) {}

    ListaDeUsuarios: PerfilDeUsuarioRequest[] = []; // Variável para armazenar os usuários


    listaDeEditorias: EditoriaRequest[] = []; // Variável para armazenar as editorias
    ListaDeStatus: StatusRequest[] = []; // Variável para armazenar os status
    nomeProcurado: string = '';
    cpfProcurado: string = '';
    emailProcurado: string = '';
    isFiltroAplicado = false; // Flag de controle para saber se os filtros foram aplicados
  
    
      // Dados fictícios para a tabela
      infosPerfilUsuarioRequest: PerfilDeUsuarioRequest[] = [
        {
          IdUsuario: 0,
          nome: 'Carregando...',
          cpf: 'Carregando...',
          email: 'Carregando...',
          contato: 'Carregando...',
          tipoDeUsuario: 'Carregando...',
          endereco: 'Carregando...', // Pode ser null
          acessoPremium: false,
          tempoDeAcesso: '',
          dataDeNascimento:'',
          premiumExpiraEm: '',
        },
      ];
    
      filtroDeBusca: PerfilDeUsuarioResponse = {
        IdUsuario: 0,
        nome: 'Carregando...',
        cpf: 'Carregando...',
        email: 'Carregando...',
        contato: 'Carregando...',
        tipoDeUsuario: 'Carregando...',
        endereco: 'Carregando...', // Pode ser null
        acessoPremium: false,
        tempoDeAcesso: '',
        dataDeNascimento:'',
        premiumExpiraEm: '',
      }
    
    
      ngOnInit(): void {
      
        if (this.isFiltroAplicado) {
          this.aplicarFiltros(); // Se já há um filtro, aplica automaticamente ao carregar a página
        } else {
          this.carregarTodosOsUsuarios(); // Caso contrário, carrega todas as notícias
        }
      
        this.carregarEditorias(); 
        this.carregarStatus();
      }
    
      dataSource = new MatTableDataSource(this.infosPerfilUsuarioRequest);
    
      @ViewChild(MatPaginator) paginator!: MatPaginator;
    
      ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
      }
      
      displayedColumns: string[] = ['titulo', 'descricao', 'nomeCategoria', 'nomeStatus', 'premiumOuComum',  'dataCriacao', 'actions'];
    
    
      aplicarFiltros() {
        this.filtroDeBusca = {
          IdUsuario: 0,
          contato: 'Carregando...',
          nome: this.nomeProcurado,
          cpf: this.cpfProcurado,
          email: this.emailProcurado,
          tipoDeUsuario: 'Carregando...',
          endereco: 'Carregando...', // Pode ser null
          acessoPremium: false,
          tempoDeAcesso: '',
          dataDeNascimento:'',
          premiumExpiraEm: '',

        };

      
        if (
          this.filtroDeBusca.nome === '' &&
          this.filtroDeBusca.cpf === '' &&
          this.filtroDeBusca.email === ''
        ) {
          this.carregarTodosOsUsuarios();
        }
    
        // Definir que os filtros foram aplicados
        this.isFiltroAplicado = true;
      
        this._perfilService.carregarTodasAsPostagensPorFiltro(this.filtroDeBusca).subscribe({
          next: (response) => {
            
            // Atualiza a lista de postagens e a fonte de dados da tabela
            this.infosPerfilUsuarioRequest = response;
            this.dataSource.data = this.infosPerfilUsuarioRequest;
            
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
        this.nomeProcurado = '';
        this.cpfProcurado = '';
        this.emailProcurado = '';
        
        // Resetando a flag de filtro aplicado
        this.isFiltroAplicado = false;
      
        // Carregar todas as postagens novamente sem filtros
        this.carregarTodosOsUsuarios();
      }
      
    
      visualizarUsuario(IdUsuario: number) {
        if (!IdUsuario) {
          this._snackBarService.MostrarErro(
            'ID da postagem não encontrado. Não é possível editar.'
          );
          return;
        }
        this._router.navigate(['/perfil-de-usuario/', IdUsuario]);
        }
    
    
      editarUsuario(id: number): void {
      if (!id) {
        this._snackBarService.MostrarErro(
          'ID da postagem não encontrado. Não é possível editar.'
        );
        return;
      }
      this._router.navigate(['/editar-noticia/', id]);
    }
    
    excluirUsuario(idPostagem: number): void {
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
                  this.infosPerfilUsuarioRequest = [];
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
    
    carregarTodosOsUsuarios(): void {
      this._perfilService.carregarTodosOsPerfis().subscribe(
        (dados) => {
          this.infosPerfilUsuarioRequest = dados;
          this.dataSource.data = this.infosPerfilUsuarioRequest;  // Atualize a fonte de dados da tabela
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
