import { ChangeDetectionStrategy,  Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { NoticiaService } from '../../services/noticia-service';
import { SnackbarService } from '../../services/snackbar.service';
import { PostagemRequest } from '../../core/interfaces/Request/Postagem';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-banner',
  imports: [MatCardModule, MatButtonModule, CommonModule, MatCardModule ],
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BannerComponent {
  constructor(
    private _noticiaService: NoticiaService,
    private _snackBarService: SnackbarService,
    private router: Router,
  
  ){}

  ngOnInit(): void {
    this.carregarUltimasNoticias();
  }

  infosPostagem: PostagemRequest[] = [];

  carregarUltimasNoticias(): void {
    this._noticiaService.carregarUltimasPostagens().subscribe(
      (dados: any[]) => {
        console.log('Dados recebidos:', dados); // Verifique os dados recebidos
        this.infosPostagem = dados;
      },
      (erro) => {
        console.error('Erro ao carregar a notícia:', erro);
      }
    );
  }

  compartilharPostagem(postagem: any): void {
    console.log('Compartilhando postagem:', postagem);
    // Implementar lógica de compartilhamento
  }

  navegarParaNoticia(idPostagem: number): void {
    this.router.navigate(['/noticia', idPostagem]);
  }


}
