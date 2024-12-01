import { TestBed } from '@angular/core/testing';

import { AisentonaService } from './aisentona.service';

describe('AisentonaService', () => {
  let service: AisentonaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AisentonaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
