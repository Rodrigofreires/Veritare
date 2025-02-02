import { AfterViewInit, Component, ViewChild } from '@angular/core';
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
import { NoticiaService } from '../../services/noticia-service';
import { SnackbarService } from '../../services/snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  ],
  templateUrl: './painel-de-controle.component.html',
  styleUrls: ['./painel-de-controle.component.css'],
})

export class PainelDeControleComponent implements AfterViewInit {

  constructor(
    private _noticiaService: NoticiaService,
    private _snackBarService: SnackbarService,
        private _route: ActivatedRoute,
        private _router: Router,
  ) {}

  ngOnInit(): void {
    this.carregarTodasAsNoticias();
  }


  searchName: string = '';
  selectedStatus: string | null = null;
  selectedEditor: string | null = null;

  // Lista de opções para o filtro de status
  statuses: string[] = ['Draft', 'Published', 'Archived'];

  // Lista de editores para o filtro de editor
  editors: string[] = ['Editor 1', 'Editor 2', 'Editor 3'];

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
    },
  ];

  displayedColumns: string[] = ['titulo', 'descricao', 'nomeCategoria', 'nomeStatus', 'dataCriacao', 'actions'];



editarNoticia(id: number): void {
  if (!id) {
    this._snackBarService.MostrarErro(
      'ID da postagem não encontrado. Não é possível editar.'
    );
    return;
  }
  this._router.navigate(['/editar-noticia/', id]);
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


sharePostagem() {
  throw new Error('Method not implemented.');
  }
  deletePostagem() {
  throw new Error('Method not implemented.');
  }

applyFilters() {
throw new Error('Method not implemented.');
}

  dataSource = new MatTableDataSource(this.infosPostagem);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }



}
