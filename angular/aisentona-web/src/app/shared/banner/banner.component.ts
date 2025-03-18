import { Component, OnInit } from '@angular/core';
import { PostagemRequest } from '../../core/interfaces/Request/Postagem';
import { NoticiaService } from '../../services/noticia-service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-banner',
  imports: [MatCardModule, MatButtonModule, CommonModule, MatCardModule ],
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
})
export class BannerComponent implements OnInit {
  
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
      premiumOuComum: true
    },
  ];

  constructor(
    private _noticiaService: NoticiaService,
    private _snackBarService: SnackbarService,
    private router: Router,

  ) {}

  ngOnInit(): void {
    this.carregarUltimasNoticias();
  }

  carregarUltimasNoticias(): void {
    this._noticiaService.carregarUltimasPostagens().subscribe(
      (dados: PostagemRequest[]) => {
        this.infosPostagem = dados;
      },
      (erro) => {
        console.error('Erro ao carregar as notícias:', erro);
      }
    );
  }

  navegarParaNoticia(idPostagem: number): void {
    this.router.navigate(['/noticia', idPostagem]);
  }

  compartilharPostagem(postagem: PostagemRequest): void {
    console.log('Compartilhando postagem:', postagem);
  }
}
