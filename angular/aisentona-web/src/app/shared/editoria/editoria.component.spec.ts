import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditoriaComponent } from './editoria.component';

describe('EditoriaComponent', () => {
  let component: EditoriaComponent;
  let fixture: ComponentFixture<EditoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditoriaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
