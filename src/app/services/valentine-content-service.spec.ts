import { TestBed } from '@angular/core/testing';

import { ValentineContentService } from './valentine-content-service';

describe('ValentineContentService', () => {
  let service: ValentineContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValentineContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
