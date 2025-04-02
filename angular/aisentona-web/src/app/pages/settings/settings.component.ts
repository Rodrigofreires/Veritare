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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
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
import { provideNgxMask, NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { AuthService } from '../../services/auth.service';
import { TipoDeUsuarioRequest } from '../../core/interfaces/Request/TipoDeUsuário';
import { ModalEditarUsuarioComponent } from '../Modals/modal-editar-usuario/modal-editar-usuario.component';

@Component({
  selector: 'app-painel-de-controle',
  standalone: true,
  providers: [DatePipe, provideNgxMask()],
  
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
    NgxMaskPipe,
    MatDialogModule,
 
  ],
  
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})


export class SettingsComponent {

   constructor(
      private _snackBarService: SnackbarService,
      private _perfilService: PerfilService,
      private _router: Router,
      private cdr: ChangeDetectorRef,
      private dialog: MatDialog,
      private _authService: AuthService,

    ) {}

    ListaDeUsuarios: PerfilDeUsuarioRequest[] = []; // Variável para armazenar os usuários
    ListaDeTiposDeUsuarios: TipoDeUsuarioRequest[] = [];
    tiposDeUsuarios: number = 0; 
    nomeProcurado: string = '';
    cpfProcurado: string = '';
    emailProcurado: string = '';
    contatoProcurado: string = '';
    tipoDeUsuarioProcurado: string = '';
    premiumComumProcurado: boolean = false;
    dataExpiracaoProcurada: string = '';
    selectedDate: string = '';
    
    isFiltroAplicado = false; // Flag de controle para saber se os filtros foram aplicados
  
    // Dados fictícios para a tabela
    infosPerfilUsuarioRequest: PerfilDeUsuarioRequest[] = [
      {
        IdUsuario: 0,
        nome: 'Carregando...',
        cpf: 'Carregando...',
        email: 'Carregando...',
        contato: 'Carregando...',
        nomeTipoDeUsuario: 'Carregando...',
        IdTipoUsuario: 0,
        endereco: 'Carregando...', // Pode ser null
        acessoPremium: false,
        tempoDeAcesso: '',
        dataDeNascimento:'',
        premiumExpiraEm: '',
      },
    ];
    
    filtroDeBusca: PerfilDeUsuarioResponse = {
      IdUsuario: 0,
      Nome: 'Carregando...',
      CPF: 'Carregando...',
      Email: 'Carregando...',
      Contato: 'Carregando...',
      nomeTipoDeUsuario: 'Carregando...',
      IdTipoUsuario: 0,
      Endereco: 'Carregando...', // Pode ser null
      AcessoPremium: false,
      TempoDeAcesso: '',
      DataDeNascimento:'',
      PremiumExpiraEm: '',
    }
      ngOnInit(): void {
      
        this.carregarTiposDeUsuários()

        if (this.isFiltroAplicado) {
          this.aplicarFiltros(); // Se já há um filtro, aplica automaticamente ao carregar a página
        } else {
          this.carregarTodosOsUsuarios(); // Caso contrário, carrega todas as notícias
        }
      }
    
      dataSource = new MatTableDataSource(this.infosPerfilUsuarioRequest);
    
      @ViewChild(MatPaginator) paginator!: MatPaginator;
    
      ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
      }
      
      displayedColumns: string[] = ['nome', 'contato', 'email', 'tipoDeUsuario','premiumOuComum', 'premiumExpiraEm', 'actions'];
    
      aplicarFiltros() {
        this.filtroDeBusca = {
          IdUsuario: 0,
          Nome: this.nomeProcurado,
          Contato: this.contatoProcurado,
          Email: this.emailProcurado,
          nomeTipoDeUsuario: this.tipoDeUsuarioProcurado,
          IdTipoUsuario: this.tiposDeUsuarios,
          PremiumExpiraEm: this.dataExpiracaoProcurada,
          CPF: this.cpfProcurado,
          Endereco: 'Carregando...', 
          AcessoPremium: this.premiumComumProcurado,
          TempoDeAcesso: '',
          DataDeNascimento:'',

        };
      
        if (
          this.filtroDeBusca.Nome === '' &&
          this.filtroDeBusca.Contato === '' &&
          this.filtroDeBusca.Email === '' &&
          this.filtroDeBusca.nomeTipoDeUsuario === ''
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
        this.contatoProcurado = '';
        this.tipoDeUsuarioProcurado = '';
        this.premiumComumProcurado = false;
        
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
        abrirModalEditarUsuario(idUsuario: number): void {
          this._perfilService.carregarPerfilDoUsuario(idUsuario).subscribe(
            (perfilSelecionado) => {
              console.log("Perfil Selecionado:", perfilSelecionado);
        
              const dialogRef = this.dialog.open(ModalEditarUsuarioComponent, {
                width: '60vw',
                maxWidth: '60vw',
                data: { 
                  perfilSelecionado: perfilSelecionado, 
                  ListaDeTiposDeUsuarios: this.ListaDeTiposDeUsuarios,
                  premiumComumProcurado: this.premiumComumProcurado, 
                }
              });
        
              // Após fechar o modal, atualiza os dados da lista
              dialogRef.afterClosed().subscribe((perfilAtualizado) => {
                if (perfilAtualizado) {
                  this.carregarTodosOsUsuarios(); // Atualiza a lista de usuários
                }
              });
            },
            (error) => {
              console.error("Erro ao carregar o perfil do usuário:", error);
            }
          );
        }
    
    verBotaoExcluirUsuario(): boolean {
      return this._authService.podeExcluirUsuario();
    }

    excluirUsuario(idUsuario: number): void {
          const dialogRef = this.dialog.open(ConfirmacaoDialogComponent);
        
          dialogRef.afterClosed().subscribe((confirmado) => {
            if (confirmado) {
              if (!idUsuario) {
                this._snackBarService.MostrarErro('Usuário não identificado para exclusão.');
                return;
              }
        
              this._perfilService.excluirPerfilDoUsuario(idUsuario).subscribe(
                () => {
                  this._snackBarService.MostrarSucesso('Usuário excluído com sucesso.');
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

    carregarTiposDeUsuários(): void {
      this._perfilService.buscarTiposDeUsuarios().subscribe(
        (data) => {
          this.ListaDeTiposDeUsuarios = data; // Atribui os dados retornados pela API
        },
        (error) => {
          console.error('Erro ao carregar editorias:', error);
        }
      );
    }



}
