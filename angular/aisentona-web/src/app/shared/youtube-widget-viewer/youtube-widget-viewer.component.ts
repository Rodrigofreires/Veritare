import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { YoutubeWidget } from '../../core/interfaces/Model/YoutubeWidget';
import { YoutubeWidgetService } from '../../services/YoutubeWidgetService';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';

@Component({
  standalone: true,
  selector: 'app-youtube-widget-viewer',
  imports: [
    CommonModule,
    MatCardModule,
    MatDivider,
  ],
  templateUrl: './youtube-widget-viewer.component.html',
  styleUrl: './youtube-widget-viewer.component.css'
})


export class YoutubeWidgetViewerComponent implements OnInit {



  constructor(
    private widgetService: YoutubeWidgetService,
    private sanitizer: DomSanitizer
  ) {}


  @Input() tipo?: 'video' | 'playlist' | 'canal';
  @Input() widgetId?: number;
  widgets: YoutubeWidget[] = [];
  
  ngOnInit() {
    if (this.widgetId) {
      this.widgetService.getWidgetById(this.widgetId).subscribe(widget => {
        this.widgets = [widget]; // coloca em array para reutilizar o mesmo *ngFor
      });
    } else if (this.tipo) {
      const tipoSelecionado = this.tipo.toLowerCase();
      this.widgetService.getWidgetsByTipo(tipoSelecionado).subscribe(widgets => {
        this.widgets = widgets;
      });
    }
  }
  getEmbedUrl(widget: YoutubeWidget): SafeResourceUrl {
    let url = '';
    switch (widget.tipo) {
      case 'video':
        url = `https://www.youtube.com/embed/${widget.youtubeId}`;
        break;
      case 'playlist':
        url = `https://www.youtube.com/embed/videoseries?list=${widget.youtubeId}`;
        break;
      case 'canal':
        url = `https://www.youtube.com/embed?listType=user_uploads&list=${widget.youtubeId}`;
        break;
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}