import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { PostagemRequest } from '../../core/interfaces/Request/Postagem';
import { NoticiaService } from '../../services/noticia-service';
import { SnackbarService } from '../../services/snackbar.service';
import { NavigationService } from '../../services/navigation.service';


declare var bootstrap: any;

@Component({
  standalone: true,
  selector: 'app-banner-noticias-premium',
  imports: [
    CommonModule,
    MatCardModule,
  ],
  templateUrl: './banner-noticias-premium.component.html',
  styleUrl: './banner-noticias-premium.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BannerNoticiasPremiumComponent implements OnInit, AfterViewInit, OnDestroy {
  infosPostagem: PostagemRequest[] = [];
  carouselInstance: any;
  private isBrowser: boolean; // Flag para saber se estamos no navegador

  constructor(
    private _noticiaService: NoticiaService,
    private _snackBarService: SnackbarService,
    private _navigationService: NavigationService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object // Injeta PLATFORM_ID
  ) {
    this.isBrowser = isPlatformBrowser(platformId); // Define a flag no construtor
  }

  ngOnInit(): void {
    this.carregarUltimasNoticiasPremium();
  }

  ngAfterViewInit(): void {
    // Só tenta inicializar o carrossel se estiver no navegador
    if (this.isBrowser && this.infosPostagem.length > 0) {
      this.tryInitializeBootstrapCarousel();
    }
  }

  ngOnDestroy(): void {
    // Só tenta destruir o carrossel se estiver no navegador e a instância existir
    if (this.isBrowser && this.carouselInstance) {
      this.carouselInstance.dispose();
      this.carouselInstance = null;
    }
  }

  carregarUltimasNoticiasPremium(): void {
    this._noticiaService.carregarUltimasNoticiasPremium().subscribe(
      (dados: PostagemRequest[]) => {
        const dadosValidos = dados.filter(postagem =>
            postagem &&
            postagem.titulo &&
            postagem.imagem &&
            postagem.descricao
        );

        this.infosPostagem = dadosValidos.slice(0, 3);
        this.cdr.detectChanges(); // Força a detecção de mudanças

        if (this.isBrowser && this.infosPostagem.length > 0) { // Verifica o ambiente antes de tentar inicializar
          this.tryInitializeBootstrapCarousel();
        } else if (!this.isBrowser && this.infosPostagem.length === 0) {
            // No SSR, se não há dados, não faz nada com o carrossel.
            // A inicialização real ocorre no navegador.
        } else if (this.isBrowser && this.infosPostagem.length === 0) {
            // Se estiver no navegador e não houver dados, destrói a instância existente.
            if (this.carouselInstance) {
                this.carouselInstance.dispose();
                this.carouselInstance = null;
            }
        }

      },
      (erro) => {
        console.error('Erro ao carregar as notícias:', erro);
        this._snackBarService.MostrarErro('Erro ao carregar notícias premium.', erro);
        this.cdr.detectChanges();
        // Em caso de erro, só tenta destruir se estiver no navegador
        if (this.isBrowser && this.carouselInstance) {
          this.carouselInstance.dispose();
          this.carouselInstance = null;
        }
      }
    );
  }

  tryInitializeBootstrapCarousel(): void {
    // Só executa o setTimeout e a lógica do Bootstrap no navegador
    if (this.isBrowser) {
        setTimeout(() => {
            // A verificação `typeof (window as any).bootstrap !== 'undefined'`
            // ainda é útil como uma camada extra de segurança para o timing.
            if (typeof (window as any).bootstrap !== 'undefined') {
                const carouselElement = document.getElementById('premiumNewsBootstrapCarousel');
                if (carouselElement) {
                    if (this.carouselInstance) {
                        this.carouselInstance.dispose();
                    }
                    this.carouselInstance = new (window as any).bootstrap.Carousel(carouselElement, {
                        interval: 5000,
                        wrap: true,
                        keyboard: true,
                        touch: true
                    });
                    this.carouselInstance.to(0);
                    console.log('Bootstrap Carousel inicializado e setado para o primeiro slide.');
                } else {
                    console.warn('Elemento #premiumNewsBootstrapCarousel não encontrado para inicialização do carrossel.');
                }
            } else {
                console.warn('Objeto "bootstrap" não definido. Tentando novamente...');
                // Tenta novamente em 100ms se 'bootstrap' ainda não estiver carregado (timing do navegador)
                setTimeout(() => this.tryInitializeBootstrapCarousel(), 100);
            }
        }, 0);
    }
  }

  navegarParaNoticia(postagem: PostagemRequest): void {
    if (!postagem.idCategoria) {
      console.error('Postagem não tem idCategoria');
      this._snackBarService.MostrarErro('Não foi possível navegar para a notícia: categoria ausente.');
      return;
    }

    this._noticiaService.buscarListaDeEditorias().subscribe(listaDeEditorias => {
      const categoria = listaDeEditorias.find(editoria => editoria.id === postagem.idCategoria);

      if (categoria) {
        const postagemComCategoria: PostagemRequest = {
          ...postagem,
          nomeCategoria: categoria.nome
        };
        this._navigationService.onAbrirNoticia(postagemComCategoria, categoria);
      } else {
        console.error('Categoria não encontrada para a postagem');
        this._snackBarService.MostrarErro('Não foi possível navegar: categoria não encontrada.');
      }
    });
  }
}