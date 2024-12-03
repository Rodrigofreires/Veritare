import { Component, NgModule } from '@angular/core';
import { FooterComponent } from '../../shared/footer/footer.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ContainerComponent } from "../../shared/container/container.component";
import {MatSelectModule} from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // Se for usar ícones
import { MatNativeDateModule } from '@angular/material/core'; // Para o mat-datepicker



@Component({
  selector: 'app-cadastro-de-noticia',
  imports: [FooterComponent, ContainerComponent, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule, MatSelectModule, CommonModule, MatSelectModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './cadastro-de-noticia.component.html',
  styleUrls: ['./cadastro-de-noticia.component.css'],
  standalone: true


})
export class CadastroDeNoticiaComponent {
  editorias: string[] = ['Política', 'Cultura', 'Economia'];



}
