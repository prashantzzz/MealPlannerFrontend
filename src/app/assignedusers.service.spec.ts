import { TestBed } from '@angular/core/testing';

import { AssignedusersService } from './assignedusers.service';

describe('AssignedusersService', () => {
  let service: AssignedusersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssignedusersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
