import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNoticiaBloqueadaComponent } from './modal-noticia-bloqueada.component';

describe('ModalNoticiaBloqueadaComponent', () => {
  let component: ModalNoticiaBloqueadaComponent;
  let fixture: ComponentFixture<ModalNoticiaBloqueadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalNoticiaBloqueadaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalNoticiaBloqueadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
