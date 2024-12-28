import { Component, OnInit  } from '@angular/core';
import { FooterComponent } from '../../shared/footer/footer.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ContainerComponent } from "../../shared/container/container.component";
import {MatSelectModule} from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { EditoriaRequest } from '../../core/interfaces/Request/Editorias';
import { NoticiaService } from '../../services/noticia-service';
import { PostagemResponse } from '../../core/interfaces/Response/Postagem';
import { FormsModule } from '@angular/forms';
import { StatusRequest } from '../../core/interfaces/Request/Status';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-cadastro-de-noticia',
  imports: [FooterComponent, 
    ContainerComponent, 
    MatFormFieldModule,
     MatDatepickerModule, 
     MatNativeDateModule, 
     MatSelectModule, 
     CommonModule, 
     MatSelectModule, 
     MatInputModule, 
     MatButtonModule, 
     MatIconModule,
     FormsModule, 

    ],

  templateUrl: './cadastro-de-noticia.component.html',
  styleUrls: ['./cadastro-de-noticia.component.css'],
  

})
export class CadastroDeNoticiaComponent {



  listaDeEditorias: EditoriaRequest[] = []; // Variável para armazenar as editorias
  ListaDeStatus: StatusRequest[] = []; // Variável para armazenar os status
  
  editoriaSelecionada: number = 0;  
  statusSelecionado: number = 0;  

  infosPostagem: PostagemResponse = {} as PostagemResponse;


  constructor(
    private _noticiaService: NoticiaService,
    private _snackBarService: SnackbarService,
  
  ) {
    
    }


    ngOnInit(): void {
      this.carregarEditorias(); // Carrega as editorias ao inicializar o componente
      this.carregarStatus();
    }

    carregarEditorias(): void {
      this._noticiaService.buscarListaDeEditorias().subscribe(
        (data) => {
          this.listaDeEditorias = data; // Atribui os dados retornados pela API

        },
        (error) => {
          console.error('Erro ao carregar editorias:', error);
        }
      );     
  }

  carregarStatus(): void {
    this._noticiaService.buscarListaDeStatus().subscribe(
      (data) => {
        this.ListaDeStatus = data; // Atribui os dados retornados pela API

      },
      (error) => {
        console.error('Erro ao carregar editorias:', error);
      }
    );
}

publicarNoticia(): void {
  
  this.infosPostagem.idCategoria = this.editoriaSelecionada;
  this.infosPostagem.idStatus = this.statusSelecionado;
  this.infosPostagem.imagem = ""
  this.infosPostagem.idUsuario = 1010;

  console.log('Dados enviados:', this.infosPostagem);

  this._noticiaService.criarPostagem(this.infosPostagem).subscribe(
    (response) => {
      this._snackBarService.MostrarSucesso('Notícia salva com sucesso!');
    },
    (error) => {
      console.error('Erro ao publicar notícia:', error);
      this._snackBarService.MostrarErro('Não foi possível publicar a notícia. Preencha os campos corretamente.');
    }
  );
}





}
  
