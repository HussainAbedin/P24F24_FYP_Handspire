import { TestBed } from '@angular/core/testing';

import { AslService } from './asl.service';

describe('AslService', () => {
  let service: AslService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AslService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
