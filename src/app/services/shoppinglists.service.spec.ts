import { TestBed } from '@angular/core/testing';

import { ShoppinglistsService } from './shoppinglists.service';

describe('ShoppinglistsService', () => {
  let service: ShoppinglistsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShoppinglistsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
