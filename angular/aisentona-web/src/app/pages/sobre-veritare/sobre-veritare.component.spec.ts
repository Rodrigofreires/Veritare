import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SobreVeritareComponent } from './sobre-veritare.component';

describe('SobreVeritareComponent', () => {
  let component: SobreVeritareComponent;
  let fixture: ComponentFixture<SobreVeritareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SobreVeritareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SobreVeritareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
