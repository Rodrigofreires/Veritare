import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YoutubeWidgetViewerComponent } from './youtube-widget-viewer.component';

describe('YoutubeWidgetViewerComponent', () => {
  let component: YoutubeWidgetViewerComponent;
  let fixture: ComponentFixture<YoutubeWidgetViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YoutubeWidgetViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YoutubeWidgetViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
