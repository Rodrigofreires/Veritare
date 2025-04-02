import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerNoticiasPremiumComponent } from './banner-noticias-premium.component';

describe('BannerNoticiasPremiumComponent', () => {
  let component: BannerNoticiasPremiumComponent;
  let fixture: ComponentFixture<BannerNoticiasPremiumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerNoticiasPremiumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannerNoticiasPremiumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
