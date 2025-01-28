import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-painel-de-controle',
  standalone: true,

  providers: [DatePipe],
  
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatCheckboxModule,
    MatDividerModule,
    FormsModule,
    CommonModule,
    MatPaginator, 
  ],
  templateUrl: './painel-de-controle.component.html',
  styleUrls: ['./painel-de-controle.component.css'],
})
export class PainelDeControleComponent implements AfterViewInit {
  searchName: string = '';
  selectedStatus: string | null = null;
  selectedEditor: string | null = null;

  // Lista de opções para o filtro de status
  statuses: string[] = ['Draft', 'Published', 'Archived'];

  // Lista de editores para o filtro de editor
  editors: string[] = ['Editor 1', 'Editor 2', 'Editor 3'];

  // Dados fictícios para a tabela
  newsData = [
    {
      name: 'Breaking News',
      description: 'This is a breaking news article.',
      editor: 'Editor 1',
      status: 'Published',
      date: new Date(),
    },
    {
      name: 'Local News',
      description: 'This is a local news article.',
      editor: 'Editor 2',
      status: 'Draft',
      date: new Date(),
    },
    {
      name: 'Sports Update',
      description: 'Latest updates on sports.',
      editor: 'Editor 3',
      status: 'Archived',
      date: new Date(),
    },
    {
      name: 'Sports Update',
      description: 'Latest updates on sports.',
      editor: 'Editor 3',
      status: 'Archived',
      date: new Date(),
    },
    {
      name: 'Sports Update',
      description: 'Latest updates on sports.',
      editor: 'Editor 3',
      status: 'Archived',
      date: new Date(),
    },
    {
      name: 'Sports Update',
      description: 'Latest updates on sports.',
      editor: 'Editor 3',
      status: 'Archived',
      date: new Date(),
    },
    {
      name: 'Sports Update',
      description: 'Latest updates on sports.',
      editor: 'Editor 3',
      status: 'Archived',
      date: new Date(),
    },
    {
      name: 'Sports Update',
      description: 'Latest updates on sports.',
      editor: 'Editor 3',
      status: 'Archived',
      date: new Date(),
    },
    {
      name: 'Sports Update',
      description: 'Latest updates on sports.',
      editor: 'Editor 3',
      status: 'Archived',
      date: new Date(),
    },
    {
      name: 'Sports Update',
      description: 'Latest updates on sports.',
      editor: 'Editor 3',
      status: 'Archived',
      date: new Date(),
    },
    {
      name: 'Sports Update',
      description: 'Latest updates on sports.',
      editor: 'Editor 3',
      status: 'Archived',
      date: new Date(),
    },
    {
      name: 'Sports Update',
      description: 'Latest updates on sports.',
      editor: 'Editor 3',
      status: 'Archived',
      date: new Date(),
    },
    {
      name: 'Sports Update',
      description: 'Latest updates on sports.',
      editor: 'Editor 3',
      status: 'Archived',
      date: new Date(),
    },
    {
      name: 'Sports Update',
      description: 'Latest updates on sports.',
      editor: 'Editor 3',
      status: 'Archived',
      date: new Date(),
    },
    {
      name: 'Sports Update',
      description: 'Latest updates on sports.',
      editor: 'Editor 3',
      status: 'Archived',
      date: new Date(),
    },
    {
      name: 'Sports Update',
      description: 'Latest updates on sports.',
      editor: 'Editor 3',
      status: 'Archived',
      date: new Date(),
    },

    {
      name: 'Sports Update',
      description: 'Latest updates on sports.',
      editor: 'Editor 3',
      status: 'Archived',
      date: new Date(),
    },
    {
      name: 'Sports Update',
      description: 'Latest updates on sports.',
      editor: 'Editor 3',
      status: 'Archived',
      date: new Date(),
    },
    {
      name: 'Sports Update',
      description: 'Latest updates on sports.',
      editor: 'Editor 3',
      status: 'Archived',
      date: new Date(),
    },
    {
      name: 'Sports Update',
      description: 'Latest updates on sports.',
      editor: 'Editor 3',
      status: 'Archived',
      date: new Date(),
    },
    {
      name: 'Sports Update',
      description: 'Latest updates on sports.',
      editor: 'Editor 3',
      status: 'Archived',
      date: new Date(),
    },
    {
      name: 'Sports Update',
      description: 'Latest updates on sports.',
      editor: 'Editor 3',
      status: 'Archived',
      date: new Date(),
    },
    {
      name: 'Sports Update',
      description: 'Latest updates on sports.',
      editor: 'Editor 3',
      status: 'Archived',
      date: new Date(),
    },
    {
      name: 'Sports Update',
      description: 'Latest updates on sports.',
      editor: 'Editor 3',
      status: 'Archived',
      date: new Date(),
    },
    {
      name: 'Sports Update',
      description: 'Latest updates on sports.',
      editor: 'Editor 3',
      status: 'Archived',
      date: new Date(),
    },
    // Adicione mais dados fictícios para testar a paginação
  ];

  displayedColumns: string[] = [
    'name',
    'description',
    'editor',
    'status',
    'date',
    'actions',
  ];

  dataSource = new MatTableDataSource(this.newsData);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  // Métodos de ação
  editNews(news: any): void {
    console.log('Editing news:', news);
  }

  deleteNews(news: any): void {
    console.log('Deleting news:', news);
  }

  shareNews(news: any): void {
    console.log('Sharing news:', news);
  }
}
