import { TestBed } from '@angular/core/testing';

import { ShineProductService } from './shine-product.service';

describe('ShineProductService', () => {
  let service: ShineProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShineProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
