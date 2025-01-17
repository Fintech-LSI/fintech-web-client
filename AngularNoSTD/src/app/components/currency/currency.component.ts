import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../../services/currency/currency.service';
import { CurrencyResponse } from '../../models/currency-response.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss'],
  standalone: false,
})
export class CurrencyComponent implements OnInit {
  currencies: CurrencyResponse[] = [];
  newCurrency: CurrencyResponse = { id: 0, name: '', code: '', exchangeRate: 0 };
  error: string = '';

  constructor(private currencyService: CurrencyService, private router: Router) { }

  ngOnInit(): void {
    this.loadCurrencies();
  }

  loadCurrencies(): void {
    this.currencyService.getAllCurrencies().subscribe({
      next: (data) => {
        this.currencies = data;
      },
      error: (error) => {
        console.error('Error fetching currencies:', error);
        this.handleError(error);
      }
    });
  }

  addCurrency(): void {
    this.currencyService.addCurrency(this.newCurrency).subscribe({
      next: (data) => {
        this.currencies.push(data);
        this.newCurrency = { id: 0, name: '', code: '', exchangeRate: 0 };
      },
      error: (error) => {
        console.error('Error adding currency:', error);
        this.handleError(error);
      }
    });
  }

  private handleError(error: any): void {
    if (error.status === 401) {
      this.error = 'You are not authorized. Please log in.';
      // Redirect to login page
      this.router.navigate(['/login']);
    } else {
      this.error = 'An error occurred. Please try again later.';
    }
  }
}

