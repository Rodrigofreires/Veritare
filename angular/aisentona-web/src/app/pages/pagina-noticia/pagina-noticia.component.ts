import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PostagemRequest } from '../../core/interfaces/Request/Postagem';
import { NoticiaService } from '../../services/noticia-service';
import { SnackbarService } from '../../services/snackbar.service';
import {MatListModule} from '@angular/material/list';
import { QuillModule } from 'ngx-quill';
import { FooterComponent } from "../../shared/footer/footer.component";

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
],
  templateUrl: './pagina-noticia.component.html',
  styleUrl: './pagina-noticia.component.css'
})
export class PaginaNoticiaComponent {

  constructor(
    private _noticiaService: NoticiaService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _snackBarService : SnackbarService

  
  ) {}

  ngOnInit(): void {
    this.carregaNoticia();

  }

textoSelecionado: string = 'ia'; // Exibe o texto da IA por padrão
infosPostagem: PostagemRequest = {} as PostagemRequest;
noticiasRelacionadas: PostagemRequest[] = [];

  mostrarTexto(opcao: string): void {
    this.textoSelecionado = opcao;
  }

  carregaNoticia(): void {
    const id = this._route.snapshot.paramMap.get('id'); // Obtém o ID como string | null
  
    if (id) {
      this. _noticiaService.buscarPostagemPorId(+id).subscribe( // Converte para number usando '+'
        (dados) => {
          this.infosPostagem = dados;
          this.carregaNoticiasRelacionadas();
        },
        (erro) => {
          this._snackBarService.MostrarErro('Erro ao carregar a notícia:', erro);
        }
      );
    } else {
      this._snackBarService.MostrarErro('ID inválido ou ausente na URL');
    }
  }

  editarNoticia(): void {
    const id = this._route.snapshot.paramMap.get('id'); // Obtém o ID diretamente da URL
  
    if (!id) {
      this._snackBarService.MostrarErro(
        'ID da postagem não encontrado na URL. Não é possível editar.'
      );
      return;
    }
  
    // Redirecionar para a página de edição com o ID da postagem
    this._router.navigate(['/editar-noticia', id]);
  }

  carregaNoticiasRelacionadas(): void {
    this._noticiaService.carregarPostagensPorEditoria(this.infosPostagem.idCategoria).subscribe(
      (dados: PostagemRequest[]) => {
        console.log('Dados recebidos:', dados);
        this.noticiasRelacionadas = dados; // Armazena as notícias relacionadas
      },
      (erro) => {
        this._snackBarService.MostrarErro('Erro ao carregar as notícias:', erro);
        console.error('Erro ao carregar as notícias:', erro);
      }
    );
  }


}
  

