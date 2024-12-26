import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class FinnhubService {
  // myAPI
  url = "http://localhost:5000" ;

  private apiKey = 'cssart9r01qld5m1bar0cssart9r01qld5m1barg'; // Replace with your Finnhub API key
  private baseUrl = 'https://finnhub.io/api/v1';

  constructor(private httpClient: HttpClient) {}

  getCompanyNews(symbol: string, from: string, to: string): Observable<any> {
    const params = new HttpParams()
      .set('symbol', symbol)
      .set('from', from)
      .set('to', to)
      .set('token', this.apiKey); // Use your Finnhub API key

    return this.httpClient.get(`${this.baseUrl}/company-news`, { params });
  }

  getRealTimeData(){
    return this.httpClient.get(this.url + "/data")
  }
}
