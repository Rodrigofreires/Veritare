import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  standalone: true,
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css'],

  imports:[
    MatCardModule,
    MatButtonModule,
    RouterModule,
    CommonModule,
    MatListModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
  ],

})


export class PricingComponent {



  constructor(
  private _route: ActivatedRoute,
  private router: Router,

  ) {}
  plans = [
    {
      name: 'Mensal',
      price: 'R$9,99',
      features: [
        'Acesso ilimitado às publicações do Site',
      ]
    },
    {
      name: 'Semestral',
      description: 'Garanta 6 meses de acesso pagando apenas 5! ',
      price: 'R$49,95',
      features: [
        'Acesso ilimitado às publicações do Site',

      ]
    },
    {
      name: 'Anual',
      description: 'Assine por 12 meses e pague apenas 10!',
      price: 'R$99,99',
      features: [
        'Acesso ilimitado às publicações do Site',
      ]
    }
  ];

  openWhatsapp() {
    window.open('https://wa.me/55119973032543', '_blank'); // Substitua pelo número correto
  }

  navigateToHome() {
    this.router.navigate(['/home'])
}

}
