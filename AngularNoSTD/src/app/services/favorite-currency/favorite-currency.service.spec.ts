import { TestBed } from '@angular/core/testing';

import { FavoriteCurrencyService } from './favorite-currency.service';

describe('FavoriteCurrencyService', () => {
  let service: FavoriteCurrencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoriteCurrencyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
