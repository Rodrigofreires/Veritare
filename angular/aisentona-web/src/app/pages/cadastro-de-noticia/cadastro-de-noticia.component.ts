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
    ],

  templateUrl: './cadastro-de-noticia.component.html',
  styleUrls: ['./cadastro-de-noticia.component.css'],
  

})
export class CadastroDeNoticiaComponent {

  editorias: EditoriaRequest[] = []; // Variável para armazenar as editorias
    
  editoriaSelecionada: any;  

  constructor(private noticiaService: NoticiaService) {  }


    ngOnInit(): void {
      this.carregarEditorias(); // Carrega as editorias ao inicializar o componente
    }


    carregarEditorias(): void {
      this.noticiaService.buscarListaDeEditorias().subscribe(
        (data) => {
          this.editorias = data; // Atribui os dados retornados pela API

          console.log("Retorno = " + this.editorias)
          console.log("Retorno 2" + this.editoriaSelecionada )

        },
        (error) => {
          console.error('Erro ao carregar editorias:', error);
        }
      );
    }
  }
  
