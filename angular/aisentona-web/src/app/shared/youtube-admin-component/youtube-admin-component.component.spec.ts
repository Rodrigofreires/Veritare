import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YoutubeAdminComponentComponent } from './youtube-admin-component.component';

describe('YoutubeAdminComponentComponent', () => {
  let component: YoutubeAdminComponentComponent;
  let fixture: ComponentFixture<YoutubeAdminComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YoutubeAdminComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YoutubeAdminComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
