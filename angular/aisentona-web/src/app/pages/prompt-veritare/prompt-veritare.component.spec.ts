import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptVeritareComponent } from './prompt-veritare.component';

describe('PromptVeritareComponent', () => {
  let component: PromptVeritareComponent;
  let fixture: ComponentFixture<PromptVeritareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromptVeritareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromptVeritareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
