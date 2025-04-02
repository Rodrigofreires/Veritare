import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmacaoCadastroComponent } from './modal-confirmacao-cadastro.component';

describe('ModalConfirmacaoCadastroComponent', () => {
  let component: ModalConfirmacaoCadastroComponent;
  let fixture: ComponentFixture<ModalConfirmacaoCadastroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalConfirmacaoCadastroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalConfirmacaoCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
