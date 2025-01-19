import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CurrencyResponse } from '../../models/currency-response.model';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private apiUrl = 'http://abb887b0c62ca480fb7bc67a5a1408f3-631602432.us-east-1.elb.amazonaws.com:8222/api/currencies';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllCurrencies(): Observable<CurrencyResponse[]> {
    return this.http.get<CurrencyResponse[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getCurrency(code: string): Observable<CurrencyResponse> {
    return this.http.get<CurrencyResponse>(`${this.apiUrl}/${code}`, { headers: this.getHeaders() });
  }

  addCurrency(currency: CurrencyResponse): Observable<CurrencyResponse> {
    return this.http.post<CurrencyResponse>(this.apiUrl, currency, { headers: this.getHeaders() });
  }
}

