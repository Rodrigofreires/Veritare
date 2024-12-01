import { Component } from '@angular/core';
import { ContainerComponent } from "../../shared/container/container.component";
import { BannerComponent } from "../../shared/banner/banner.component";
import { FooterComponent } from "../../shared/footer/footer.component";

@Component({
  selector: 'app-home',
  imports: [ContainerComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true
})
export class HomeComponent {

}
