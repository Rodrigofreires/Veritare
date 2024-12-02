import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardLeiaTambemComponent } from './card-leia-tambem.component';

describe('CardLeiaTambemComponent', () => {
  let component: CardLeiaTambemComponent;
  let fixture: ComponentFixture<CardLeiaTambemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardLeiaTambemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardLeiaTambemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
