import { Component, NgModule } from '@angular/core';
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

@Component({
  selector: 'app-cadastro-usuario',
  imports: [FooterComponent, ContainerComponent, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule, MatSelectModule, CommonModule, MatSelectModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './cadastro-usuario.component.html',
  styleUrl: './cadastro-usuario.component.css',
  standalone: true
  
})
export class CadastroUsuarioComponent {

}
