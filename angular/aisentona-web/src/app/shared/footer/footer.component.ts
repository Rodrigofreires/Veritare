import { Component } from '@angular/core';
import { ContainerComponent } from '../container/container.component';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-footer',
  imports: [ContainerComponent, MatButtonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

}
