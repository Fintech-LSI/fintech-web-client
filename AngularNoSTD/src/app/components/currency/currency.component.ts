import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../../services/currency/currency.service';
import { CurrencyResponse } from '../../models/currency-response.model';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss'],
  standalone: false
})
export class CurrencyComponent implements OnInit {
  currencies: CurrencyResponse[] = [];
  newCurrency: CurrencyResponse = { id: 0, name: '', code: '', exchangeRate: 0 };

  constructor(private currencyService: CurrencyService) { }

  ngOnInit(): void {
    this.loadCurrencies();
  }

  loadCurrencies(): void {
    this.currencyService.getAllCurrencies().subscribe(
      (data) => {
        this.currencies = data;
      },
      (error) => {
        console.error('Error fetching currencies:', error);
      }
    );
  }

  addCurrency(): void {
    this.currencyService.addCurrency(this.newCurrency).subscribe(
      (data) => {
        this.currencies.push(data);
        this.newCurrency = { id: 0, name: '', code: '', exchangeRate: 0 };
      },
      (error) => {
        console.error('Error adding currency:', error);
      }
    );
  }
}

