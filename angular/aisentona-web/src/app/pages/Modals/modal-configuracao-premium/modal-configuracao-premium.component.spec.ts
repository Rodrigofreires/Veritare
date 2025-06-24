import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfiguracaoPremiumComponent } from './modal-configuracao-premium.component';

describe('ModalConfiguracaoPremiumComponent', () => {
  let component: ModalConfiguracaoPremiumComponent;
  let fixture: ComponentFixture<ModalConfiguracaoPremiumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalConfiguracaoPremiumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalConfiguracaoPremiumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
