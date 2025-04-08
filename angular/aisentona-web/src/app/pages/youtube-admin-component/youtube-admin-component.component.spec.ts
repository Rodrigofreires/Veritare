import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YoutubeAdminComponent } from './youtube-admin-component.component';

describe('YoutubeAdminComponentComponent', () => {
  let component: YoutubeAdminComponent;
  let fixture: ComponentFixture<YoutubeAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YoutubeAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YoutubeAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
