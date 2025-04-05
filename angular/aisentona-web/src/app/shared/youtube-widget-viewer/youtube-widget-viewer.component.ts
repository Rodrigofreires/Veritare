import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { YoutubeWidget } from '../../core/interfaces/Model/YoutubeWidget';
import { YoutubeWidgetService } from '../../services/YoutubeWidgetService';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-youtube-widget-viewer',
  imports: [
    CommonModule,
  ],
  templateUrl: './youtube-widget-viewer.component.html',
  styleUrl: './youtube-widget-viewer.component.css'
})


export class YoutubeWidgetViewerComponent implements OnInit {



  constructor(
    private widgetService: YoutubeWidgetService,
    private sanitizer: DomSanitizer
  ) {}


  @Input() tipo: string = 'video'; 
  widgets: YoutubeWidget[] = [];
  

  ngOnInit() {
    const tipoPermitido = ['video', 'playlist', 'canal'];
    const tipoSelecionado = (this.tipo || '').toLowerCase();
    
    if (tipoPermitido.includes(tipoSelecionado)) {
      this.widgetService.getWidgetsByTipo(tipoSelecionado).subscribe(widgets => {
        this.widgets = widgets;
      });
    } else {
      console.warn('Tipo de widget inválido:', this.tipo);
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