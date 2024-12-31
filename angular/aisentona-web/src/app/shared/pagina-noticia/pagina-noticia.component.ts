import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CardLeiaTambemComponent } from "../card-leia-tambem/card-leia-tambem.component";
import { PostagemRequest } from '../../core/interfaces/Request/Postagem';
import { NoticiaService } from '../../services/noticia-service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  standalone: true,
  selector: 'app-pagina-noticia',
  imports: [MatCardModule, MatButtonModule, RouterModule, CommonModule, CardLeiaTambemComponent],
  templateUrl: './pagina-noticia.component.html',
  styleUrl: './pagina-noticia.component.css'
})
export class PaginaNoticiaComponent {

  constructor(
    private noticiaService: NoticiaService,
    private route: ActivatedRoute,
    private _snackBar : SnackbarService

  
  ) {}

  ngOnInit(): void {
    this.carregaNoticia();
  }


textoSelecionado: string = 'ia'; // Exibe o texto da IA por padrão
infosPostagem: PostagemRequest = {} as PostagemRequest;

  mostrarTexto(opcao: string): void {
    this.textoSelecionado = opcao;
  }

  carregaNoticia(): void {
    const id = this.route.snapshot.paramMap.get('id'); // Obtém o ID como string | null
  
    if (id) {
      this.noticiaService.buscarPostagemPorId(+id).subscribe( // Converte para number usando '+'
        (dados) => {
          this.infosPostagem = dados;
        },
        (erro) => {
          this._snackBar.MostrarErro('Erro ao carregar a notícia:', erro);
        }
      );
    } else {
      this._snackBar.MostrarErro('ID inválido ou ausente na URL');
    }
  }



}
  

