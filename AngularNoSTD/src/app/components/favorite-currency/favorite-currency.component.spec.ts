import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteCurrencyComponent } from './favorite-currency.component';

describe('FavoriteCurrencyComponent', () => {
  let component: FavoriteCurrencyComponent;
  let fixture: ComponentFixture<FavoriteCurrencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FavoriteCurrencyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoriteCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
