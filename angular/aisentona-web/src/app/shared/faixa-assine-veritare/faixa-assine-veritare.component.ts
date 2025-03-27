import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-faixa-assine-veritare',
  templateUrl: './faixa-assine-veritare.component.html',
  styleUrls: ['./faixa-assine-veritare.component.css']
})
export class FaixaAssineVeritareComponent {

  constructor(
    private router: Router) 
    {}

  navigateToAssine() {
    this.router.navigate(['/assine']);
  }
}
