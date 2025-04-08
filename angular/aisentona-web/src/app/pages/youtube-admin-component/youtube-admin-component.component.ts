import { Component, OnInit } from '@angular/core';
import { YoutubeWidget } from '../../core/interfaces/Model/YoutubeWidget';
import { YoutubeWidgetService } from '../../services/YoutubeWidgetService';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { QuillModule } from 'ngx-quill';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select'; // Corrigido
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatSidenavModule} from '@angular/material/sidenav';

@Component({
  selector: 'app-youtube-admin-component',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    RouterModule,
    MatListModule,
    QuillModule,
    MatTooltipModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
  ],
  templateUrl: './youtube-admin-component.component.html',
  styleUrls: ['./youtube-admin-component.component.css'] // Corrigido
})
export class YoutubeAdminComponent implements OnInit {

  widgets: YoutubeWidget[] = [];

  widgetForm!: FormGroup;

  widget: YoutubeWidget = this.createEmptyWidget();
  editMode: boolean = false;

  constructor(
    private service: YoutubeWidgetService,
    private fb: FormBuilder
  
  
  ) {}

  ngOnInit() {
    this.initForm(); // Inicializa o formulário
    this.loadWidgets();
  }

  initForm() {
    this.widgetForm = this.fb.group({
      id: [0],
      titulo: ['', Validators.required],
      tipo: ['video', Validators.required],
      youtubeId: ['', Validators.required]
    });
  }


  createEmptyWidget(): YoutubeWidget {
    return {
      id: 0,
      titulo: '',
      tipo: 'video', // default
      youtubeId: '',
    };
  }

  loadWidgets() {
    this.service.getWidgets().subscribe(data => this.widgets = data);
  }

  onSubmit() {
    const formValues = this.widgetForm.value;
  
    const widget: YoutubeWidget = {
      id: this.widget.id, // mantém o ID do objeto atual
      titulo: formValues.titulo,
      tipo: formValues.tipo,
      youtubeId: formValues.youtubeId
    };
  
    if (widget.id === 0) {
      this.service.create(widget).subscribe(() => {
        this.loadWidgets();
        this.widgetForm.reset({ id: 0, titulo: '', tipo: 'video', youtubeId: '' });
        this.widget = this.createEmptyWidget(); // opcional
        this.editMode = false;
      });
    } else {
      this.service.update(widget).subscribe(() => {
        this.loadWidgets();
        this.widgetForm.reset({ id: 0, titulo: '', tipo: 'video', youtubeId: '' });
        this.widget = this.createEmptyWidget(); // opcional
        this.editMode = false;
      });
    }
  }

    editWidget(widget: YoutubeWidget) {
      this.widget = widget;
      this.editMode = true;
    
      this.widgetForm.patchValue({
        titulo: widget.titulo,
        tipo: widget.tipo,
        youtubeId: widget.youtubeId
      });
    }

  cancelEdit() {
    this.widget = this.createEmptyWidget();
    this.editMode = false;
  }

  deleteWidget(id: number) {
    if (confirm('Tem certeza que deseja excluir este widget?')) {
      this.service.delete(id).subscribe(() => this.loadWidgets());
    }
  }

  onYoutubeIdBlur() {
    const tipo = this.widgetForm.get('tipo')?.value;
    const valor = this.widgetForm.get('youtubeId')?.value;
  
    let idExtraido = valor;
  
    if (tipo === 'playlist') {
      const match = valor.match(/[?&]list=([^&]+)/);
      if (match) {
        idExtraido = match[1];
      }
    } else if (tipo === 'video') {
      const match = valor.match(/[?&]v=([^&]+)/);
      if (match) {
        idExtraido = match[1];
      }
    } else if (tipo === 'canal') {
      const match = valor.match(/(channel\/|user\/)?([^\/\?\&]+)/);
      if (match) {
        idExtraido = match[2];
      }
    }
  
    this.widgetForm.patchValue({ youtubeId: idExtraido });
  }

}
