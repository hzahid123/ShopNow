import { TestBed } from '@angular/core/testing';

import { CartService } from './add-to-cart.service';

describe('AddToCartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
