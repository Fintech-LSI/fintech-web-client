import { Component, OnInit } from '@angular/core';
import { FavoriteCurrencyService } from '../../services/favorite-currency/favorite-currency.service';
import { CurrencyService } from '../../services/currency/currency.service';
import { CurrencyResponse } from '../../models/currency-response.model';
import { forkJoin, throwError } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-favorite-currency',
  templateUrl: './favorite-currency.component.html',
  styleUrls: ['./favorite-currency.component.scss'],
  standalone: false
})
export class FavoriteCurrencyComponent implements OnInit {
  allCurrencies: CurrencyResponse[] = [];
  favoriteCurrencies: CurrencyResponse[] = [];
  availableCurrencies: CurrencyResponse[] = [];
  error: string = '';
  isAddModalOpen: boolean = false;
  selectedCurrencyId: number | null = null;
  isLoading: boolean = true;
  userId: number | null = null;
  constructor(
    private favoriteCurrencyService: FavoriteCurrencyService,
    private currencyService: CurrencyService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
   this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.error = '';
      this.userService.validateToken(localStorage.getItem('token') || '').pipe(
          switchMap(response => {
            if(response.valid){
              this.userId = response.user.id;
              return this.userService.getUserById(response.user.id)
            } else {
              return  throwError(() => new Error('Invalid token'))
            }
          }),
           finalize(() => this.isLoading = false),

      ).subscribe({
        next: (user) => {
          this.favoriteCurrencies = user.favoriteCurrencies || [];
          this.currencyService.getAllCurrencies().subscribe({
            next: (allCurrencies) => {
             this.allCurrencies = allCurrencies;
              this.updateAvailableCurrencies();
            },
            error: (error) => {
              console.error('Error loading currencies:', error);
              this.error = 'Failed to load currencies. Please try again.';
            }
          })
        },
        error: (error) => {
            console.error('Error loading user data:', error);
            this.error = 'Failed to load user data. Please try again.';
        }
    });
  }
   updateAvailableCurrencies(): void {
        this.availableCurrencies = this.allCurrencies.filter(currency =>
            !this.favoriteCurrencies.some(fav => fav.id === currency.id)
        );
    }

  addFavoriteCurrency(): void {
    if (this.selectedCurrencyId) {
      this.isLoading = true;
      this.favoriteCurrencyService.addFavoriteCurrency(this.selectedCurrencyId).subscribe({
        next: () => {
          this.loadData()
          this.closeAddModal();
        },
        error: (error) => {
          console.error('Error adding favorite currency:', error);
          this.error = 'Failed to add favorite currency. Please try again.';
            this.isLoading = false;
        },
      });
    }
  }

  removeFavoriteCurrency(currencyId: number): void {
      this.isLoading = true;
    this.favoriteCurrencyService.removeFavoriteCurrency(currencyId).subscribe({
      next: () => {
        this.loadData()
      },
      error: (error) => {
        console.error('Error removing favorite currency:', error);
        this.error = 'Failed to remove favorite currency. Please try again.';
          this.isLoading = false;
      },
    });
  }

  openAddModal(): void {
    this.isAddModalOpen = true;
  }

  closeAddModal(): void {
    this.isAddModalOpen = false;
    this.selectedCurrencyId = null;
  }
}