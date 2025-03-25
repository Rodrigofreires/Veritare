import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaixaAssineVeritareComponent } from './faixa-assine-veritare.component';

describe('FaixaAssineVeritareComponent', () => {
  let component: FaixaAssineVeritareComponent;
  let fixture: ComponentFixture<FaixaAssineVeritareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaixaAssineVeritareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaixaAssineVeritareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
