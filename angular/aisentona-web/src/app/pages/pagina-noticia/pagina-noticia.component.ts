import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, SimpleChanges, ViewChild } from '@angular/core';
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
import { AuthService } from '../../services/auth.service';
import { NavigationService } from '../../services/navigation.service';
import { MatTooltipModule } from '@angular/material/tooltip';

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
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './pagina-noticia.component.html',
  styleUrls: ['./pagina-noticia.component.css']
})
export class PaginaNoticiaComponent {
  
  url: string = window.location.href;;
  alertaVisivel = false;
  alertaTexto: string = '';
  alertaPosicao = { x: 30, y: 0 };
  posicaoTooltip = { top: 30, left: 0 };
  quantidadeNoticias = 10;
  textoSelecionado = 'humano';
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
    alertas: []
  };
  noticiasRelacionadas: PostagemRequest[] = [];
  isLoggedIn = false;

  constructor(
    private _noticiaService: NoticiaService,
    private _navigationService: NavigationService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _authService: AuthService,
    private dialog: MatDialog,
    private _snackBarService: SnackbarService,
    private el: ElementRef,
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this._authService.isLoggedIn() ?? false;
    this._route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.carregaNoticia();
        this.carregaNoticiasRelacionadas();
      }
    });
  }

  ngAfterViewInit(): void {
    this.adicionarEventosNosSobrescritos();
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
      console.warn('ID da categoria não encontrado.');
      return;
    }

    this._noticiaService.carregarPostagensPorEditoria(this.infosPostagem.idCategoria).subscribe(
      dados => this.noticiasRelacionadas = dados,
      erro => this._snackBarService.MostrarErro('Erro ao carregar notícias relacionadas:', erro)
    );
  }

  acessarEditarNoticia(): boolean {
    return this._authService.acessarEditarNoticia();
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

  adicionarEventosNosSobrescritos(): void {
    const elementos = this.el.nativeElement.querySelectorAll('.ql-editor sup');
    elementos.forEach((element: HTMLElement) => {
      // Adicionando o evento de mouseenter para mostrar o alerta
      element.addEventListener('mouseenter', (event: MouseEvent) => this.mostrarAlerta(event));
      // Adicionando o evento de mouseleave para esconder o alerta
      element.addEventListener('mouseleave', () => this.esconderAlerta());
    });
  }
  
  mostrarAlerta(event: MouseEvent): void {
    const elementoTexto = (event.target as HTMLElement).innerText;
    
    // Extraindo o número do texto (assumindo o formato correto com colchetes [10], [11], etc.)
    const numeroExtraido = this.converterSobrescritoParaNumero(elementoTexto);
  
    // Verificando se o número extraído corresponde a um alerta válido
    const textoAlerta = this.infosPostagem.alertas.find(alerta =>
      alerta.numeroAlerta === numeroExtraido
    );
  
    if (textoAlerta) {
      this.alertaTexto = textoAlerta.mensagem;
      this.alertaVisivel = true;
      // Adiciona o ouvinte para mover o alerta conforme o mouse se move
      window.addEventListener('mousemove', this.atualizarPosicaoAlerta);
    } else {
      this.alertaVisivel = false;
    }
  }
  
  
  getAlertStyle() {
    return {
      top: `${this.alertaPosicao.y}px`,   // A posição vertical do alerta
      left: `${this.alertaPosicao.x}px`,  // A posição horizontal do alerta
    };
  }
  
  atualizarPosicaoAlerta = (event: MouseEvent) => {
    this.alertaPosicao = {
      x: event.clientX,
      y: event.clientY - 80, // Apenas um número, não a unidade 'px'
    };
  };
  
    
    esconderAlerta(): void {
      this.alertaVisivel = false;
      window.removeEventListener('mousemove', this.atualizarPosicaoAlerta);
    }
  

    converterSobrescritoParaNumero(sobrescrito: string): number {
      // Remove os colchetes e tenta converter diretamente para número
      const numero = sobrescrito.replace('[', '').replace(']', '');
      return parseInt(numero, 10) || -1;  // Retorna -1 se não for um número válido
    }
    
    
  

  detectarReferenciasNaTela(): void {
    if (!this.infosPostagem || !this.infosPostagem.conteudo) {
      return;
    }
  
    // Expressão regular para detectar números entre 1 até 20 entre colchetes
    const regex = /\[(1[0-9]|20|[1-9])\]/g; // Captura números de 1 até 20 entre colchetes

    const numerosEncontrados = this.infosPostagem.conteudo.match(regex);
  
    if (numerosEncontrados) {
      numerosEncontrados.forEach((numSobrescrito) => {
        // Extrai o número do texto dentro dos colchetes
        const numeroIndice = parseInt(numSobrescrito.replace('[', '').replace(']', ''), 10);
  
        // Verifica se o número está entre 1 e 20 (isso é redundante, mas garante que estamos na faixa certa)
        if (numeroIndice >= 1 && numeroIndice <= 20) {
          // Verifica se o número não foi adicionado antes
          const alertaExistente = this.infosPostagem.alertas.find(alerta => alerta.numeroAlerta === numeroIndice);
          if (!alertaExistente) {
            this.infosPostagem.alertas.push({
              numeroAlerta: numeroIndice,
              mensagem: `Alerta ${numeroIndice} - Descrição do alerta...`
            });
          }
        }
      });
    }
  }

  copyLink(): void {
    navigator.clipboard.writeText(this.url).then(() => {
      this._snackBarService.MostrarSucesso('Link copiado com sucesso!');
    }, (err) => {
      this._snackBarService.MostrarErro('Falha ao copiar o link');
    });
  }


  
}
