import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaisLidasComponent } from './mais-lidas.component';

describe('MaisLidasComponent', () => {
  let component: MaisLidasComponent;
  let fixture: ComponentFixture<MaisLidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaisLidasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaisLidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
