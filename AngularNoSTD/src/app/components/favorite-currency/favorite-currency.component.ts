import { Component, OnInit } from '@angular/core';
import { FavoriteCurrencyService } from '../../services/favorite-currency/favorite-currency.service';
import { CurrencyService } from '../../services/currency/currency.service';
import { CurrencyResponse } from '../../models/currency-response.model';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-favorite-currency',
    templateUrl: './favorite-currency.component.html',
    styleUrls: ['./favorite-currency.component.scss'],
    standalone: false
})
export class FavoriteCurrencyComponent implements OnInit {
    availableCurrencies: CurrencyResponse[] = [];
    favoriteCurrencies: CurrencyResponse[] = [];
    error: string = '';

    constructor(
        private favoriteCurrencyService: FavoriteCurrencyService,
        private currencyService: CurrencyService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadData();
    }


    loadData(): void {
        forkJoin([
            this.currencyService.getAllCurrencies(),
            this.favoriteCurrencyService.getUserFavoriteCurrencies()
        ]).subscribe({
            next: ([allCurrencies, favoriteCurrencies]) => {
              this.availableCurrencies = allCurrencies;
              this.favoriteCurrencies = favoriteCurrencies;
              this.filterCurrencies();
            },
            error: (error) => {
                console.error('Error loading data:', error);
                this.handleError(error);
            }
        });
    }

    filterCurrencies(){
       this.availableCurrencies = this.availableCurrencies.filter(currency =>
              !this.favoriteCurrencies.some(fav => Number(fav.id) === Number(currency.id))
          );
    }

    addFavoriteCurrency(currencyId: number): void {
        this.favoriteCurrencyService.addFavoriteCurrency(currencyId).subscribe({
            next: (data) => {
              this.favoriteCurrencies.push(data);
              this.filterCurrencies();
            },
            error: (error) => {
                console.error('Error adding favorite currency:', error);
                this.handleError(error);
            }
        });
    }

    removeFavoriteCurrency(currencyId: number): void {
        this.favoriteCurrencyService.removeFavoriteCurrency(currencyId).subscribe({
            next: () => {
                this.loadData();
            },
            error: (error) => {
                console.error('Error removing favorite currency:', error);
                this.handleError(error);
            }
        });
    }

    private handleError(error: any): void {
        if (error.status === 401) {
            this.error = 'You are not authorized. Please log in.';
            this.router.navigate(['/login']);
        } else {
            this.error = 'An error occurred. Please try again later.';
        }
    }
}