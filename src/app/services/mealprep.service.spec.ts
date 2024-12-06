import { TestBed } from '@angular/core/testing';

import { MealprepService } from './mealprep.service';

describe('MealprepService', () => {
  let service: MealprepService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MealprepService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
