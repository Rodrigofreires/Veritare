import { Component } from '@angular/core';
import { LoadingService } from '../../services/loading.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';


@Component({
  standalone: true,
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css'],
  imports: [
    MatProgressSpinnerModule,
    CommonModule,
  ],
})
export class LoadingComponent {
  constructor(
    public loadingService: LoadingService) 
    
    { }
}
