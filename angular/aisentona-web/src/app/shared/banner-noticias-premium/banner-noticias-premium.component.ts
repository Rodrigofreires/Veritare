import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { PostagemRequest } from '../../core/interfaces/Request/Postagem';
import { NoticiaService } from '../../services/noticia-service';
import { SnackbarService } from '../../services/snackbar.service';
import { NavigationService } from '../../services/navigation.service';

@Component({
  standalone: true,
  selector: 'app-banner-noticias-premium',
  imports: [    
    CommonModule,
    MatCardModule,],
  templateUrl: './banner-noticias-premium.component.html',
  styleUrl: './banner-noticias-premium.component.css'
})
export class BannerNoticiasPremiumComponent {

    infosPostagem: PostagemRequest[] = [];
  
    constructor(
      private _noticiaService: NoticiaService,
      private _snackBarService: SnackbarService,
      private _navigationService: NavigationService,
      private router: Router,
    ) {}
  
    ngOnInit(): void {
      this.carregarUltimasNoticiasPremium();
    }
  
    carregarUltimasNoticiasPremium(): void {
      this._noticiaService.carregarUltimasNoticiasPremium().subscribe(
        (dados: PostagemRequest[]) => {
          this.infosPostagem = dados.slice(0, 3); // Apenas as três primeiras notícias
        },
        (erro) => {
          console.error('Erro ao carregar as notícias:', erro);
        }
      );
    }

    navegarParaNoticia(infosPostagem: PostagemRequest): void {
      // Chama o serviço que retorna a lista de editorias
      this._noticiaService.buscarListaDeEditorias().subscribe(listaDeEditorias => {
        // Filtra a categoria pela correspondência do id
        const categoria = listaDeEditorias.find(editoria => editoria.id === infosPostagem.idCategoria);
    
        if (categoria) {
          // Se encontrar a categoria, chama o serviço de navegação
          this._navigationService.onAbrirNoticia(infosPostagem, categoria);
        } else {
          console.error('Categoria não encontrada para a postagem');
        }
      });
    }    
    
  }

