import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListagemPorEditoriaComponent } from './listagem-por-editoria.component';

describe('ListagemPorEditoriaComponent', () => {
  let component: ListagemPorEditoriaComponent;
  let fixture: ComponentFixture<ListagemPorEditoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListagemPorEditoriaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListagemPorEditoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
