import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CurrencyResponse } from '../../models/currency-response.model';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private apiUrl = 'http://localhost:8222/api/currencies'; // Adjust this URL as needed

  constructor(private http: HttpClient) { }

  getAllCurrencies(): Observable<CurrencyResponse[]> {
    return this.http.get<CurrencyResponse[]>(this.apiUrl);
  }

  getCurrency(code: string): Observable<CurrencyResponse> {
    return this.http.get<CurrencyResponse>(`${this.apiUrl}/${code}`);
  }

  addCurrency(currency: CurrencyResponse): Observable<CurrencyResponse> {
    return this.http.post<CurrencyResponse>(this.apiUrl, currency);
  }
}

