import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaEditarNoticiaComponent } from './pagina-editar-noticia.component';

describe('PaginaEditarNoticiaComponent', () => {
  let component: PaginaEditarNoticiaComponent;
  let fixture: ComponentFixture<PaginaEditarNoticiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaEditarNoticiaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginaEditarNoticiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
