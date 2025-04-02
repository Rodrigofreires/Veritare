import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtivacaoSucessoComponent } from './ativacao-sucesso.component';

describe('AtivacaoSucessoComponent', () => {
  let component: AtivacaoSucessoComponent;
  let fixture: ComponentFixture<AtivacaoSucessoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtivacaoSucessoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtivacaoSucessoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
