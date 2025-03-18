import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NoticiaService } from '../../services/noticia-service';
import { SnackbarService } from '../../services/snackbar.service';
import { Router } from '@angular/router';
import { PostagemRequest } from '../../core/interfaces/Request/Postagem';
import { ContainerComponent } from "../container/container.component";

@Component({
  selector: 'app-lista-noticias',
  standalone: true,
  imports: [
    MatCardModule,
     MatButtonModule,
      CommonModule
    ],

  templateUrl: './lista-noticias.component.html',
  styleUrls: ['./lista-noticias.component.css']
})
export class ListaNoticiasComponent implements OnInit {

    infosUltimasPostagem: PostagemRequest[] = [
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
        nomeStatus:'',
        premiumOuComum: true
      },
    ];

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
        nomeStatus:'',
        premiumOuComum: true

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
        nomeStatus:'',
        premiumOuComum: true
      },
    ];

    quantidadeExibida: number = 10;

  constructor(
    private _noticiaService: NoticiaService,
    private _snackBarService: SnackbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarUltimasNoticias();
    this.carregarTodasAsNoticias();
  }

  carregarUltimasNoticias(): void {
    this._noticiaService.carregarUltimasPostagens().subscribe(
      (dados) => { this.infosUltimasPostagem = dados; },
      (erro) => { this._snackBarService.MostrarErro('Erro ao carregar notícias.', erro); }
    );
  }

  carregarTodasAsNoticias(): void {
    this._noticiaService.carregarTodasAsPostagens().subscribe(
      (dados) => {
        this.infosTodasAsPostagem = dados; // Carrega todas as notícias
        this.postagensExibidas = this.infosTodasAsPostagem.slice(0, this.quantidadeExibida); // Exibe as iniciais
      },
      (erro) => {
        console.error('Erro ao carregar todas as notícias:', erro);
        this._snackBarService.MostrarErro('Erro ao carregar notícias.', erro);
      }
    );
  }

  carregarMaisNoticias(): void {
    this.quantidadeExibida += 10; // Incrementa a quantidade de postagens exibidas
    this.postagensExibidas = this.infosTodasAsPostagem.slice(0, this.quantidadeExibida); // Atualiza a lista exibida
  }

  navegarParaNoticia(idPostagem: number): void {
    this.router.navigate(['/noticia', idPostagem]);
  }
}
  
  
