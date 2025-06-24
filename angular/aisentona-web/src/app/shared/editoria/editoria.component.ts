import { Component, OnInit, OnDestroy } from '@angular/core'; // Adicionado OnDestroy
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { EditoriaRequest } from '../../core/interfaces/Request/Editorias';
import { NoticiaService } from '../../services/noticia-service';
import { SnackbarService } from '../../services/snackbar.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PostagensPaginadas } from '../../core/interfaces/Model/PostagensPaginadas';
import { PostagemRequest } from '../../core/interfaces/Request/Postagem';

// NOVIDADES: Importações para o menu dropdown e ícones
import { MatMenuModule } from '@angular/material/menu'; // Módulo para mat-menu
import { MatIconModule } from '@angular/material/icon'; // Módulo para mat-icon
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'; // Para detectar o tamanho da tela
import { Subject } from 'rxjs'; // Para gerenciar a desinscrição de observables
import { takeUntil } from 'rxjs/operators'; // Para desinscrição de observables

@Component({
  selector: 'app-editoria',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    CommonModule,
    MatMenuModule, // Adicione MatMenuModule aqui
    MatIconModule  // Adicione MatIconModule aqui
  ],
  templateUrl: './editoria.component.html',
  styleUrls: ['./editoria.component.css']
})
export class EditoriaComponent implements OnInit, OnDestroy { // Implementado OnDestroy

  listaDeEditorias: EditoriaRequest[] = [];
  idEditoria: number | null = null;
  noticiasRelacionadas: PostagemRequest[] = [];

  isMobile: boolean = false; // NOVA PROPRIEDADE: para controlar a exibição do menu mobile
  private destroy$ = new Subject<void>(); // NOVA PROPRIEDADE: para gerenciar a desinscrição

  constructor(
    private _noticiaService: NoticiaService,
    private _snackBarService: SnackbarService,
    private router: Router,
    private breakpointObserver: BreakpointObserver // NOVO: Injetando BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.carregarEditorias();
    this.observeBreakpoints(); // NOVO: Inicia a observação dos breakpoints
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete(); // NOVO: Completa o Subject para desinscrever-se
  }

  // NOVO MÉTODO: Observa os breakpoints para determinar se é mobile
  observeBreakpoints(): void {
    this.breakpointObserver.observe([
      Breakpoints.HandsetPortrait, // Celulares em retrato
      Breakpoints.HandsetLandscape, // Celulares em paisagem
      Breakpoints.TabletPortrait, // Tablets em retrato
    ]).pipe(
      takeUntil(this.destroy$) // Garante que a observação seja cancelada ao destruir o componente
    ).subscribe(result => {
      this.isMobile = result.matches; // Define isMobile como true se qualquer um desses breakpoints for ativado
    });
  }

  carregarEditorias(): void {
    this._noticiaService.buscarListaDeEditorias().subscribe({
      next: (data) => {
        this.listaDeEditorias = data;
      },
      error: (error) => {
        console.error('Erro ao carregar editorias:', error);
        // Opcional: _snackBarService.MostrarErro('Erro ao carregar editorias.');
      }
    });
  }

  selecionarEditoria(id: number, nomeCategoria: string): void {
    this.idEditoria = id;
    this.carregarNoticiasPorEditoria(nomeCategoria);
  }

  carregarNoticiasPorEditoria(nomeCategoria: string): void {
    if (this.idEditoria === null) {
      console.error('Nenhuma editoria foi selecionada.');
      this._snackBarService.MostrarErro('Selecione uma editoria.');
      return;
    }

    const pagina = 1;
    const quantidade = 6;

    this._noticiaService.carregarPostagensPorEditoria(this.idEditoria, pagina, quantidade).subscribe({
      next: (resposta: PostagensPaginadas) => {
        this.noticiasRelacionadas = resposta.dados;

        // Redirecionar para rota
        this.router.navigate(['/lista-noticia', nomeCategoria, this.idEditoria]);
      },
      error: (erro) => {
        this._snackBarService.MostrarErro('Erro ao carregar as notícias');
        console.error('Erro ao carregar as notícias:', erro);
      }
    });
  }
}