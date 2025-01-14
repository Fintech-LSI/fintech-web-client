import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { CurrencyResponse } from '../../models/currency-response.model';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class FavoriteCurrencyService {
  private apiUrl = 'http://localhost:8222/api/users';

  constructor(private http: HttpClient, private userService: UserService) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  addFavoriteCurrency(currencyId: number): Observable<CurrencyResponse> {
      return this.userService.validateToken(localStorage.getItem('token') || '').pipe(
          switchMap(response => {
            if(response.valid){
                const userId = response.user.id;
                return this.http.post<CurrencyResponse>(`${this.apiUrl}/${userId}/favorite-currencies/${currencyId}`, {}, { headers: this.getHeaders() });
            } else {
              return throwError(() => new Error('Invalid token'));
            }
          }),
          catchError(error =>{
              console.error('Error adding favorite currency:', error);
              return throwError(() => error);
          })
      );
  }

  removeFavoriteCurrency(currencyId: number): Observable<any> {
      return this.userService.validateToken(localStorage.getItem('token') || '').pipe(
          switchMap(response => {
              if(response.valid) {
                  const userId = response.user.id;
                  return this.http.delete(`${this.apiUrl}/${userId}/favorite-currencies/${currencyId}`, { headers: this.getHeaders() });
              } else {
                return throwError(() => new Error('Invalid token'));
              }
          }),
          catchError(error =>{
              console.error('Error removing favorite currency:', error);
              return throwError(() => error);
          })
      );
  }

  getUserFavoriteCurrencies(): Observable<CurrencyResponse[]> {
    return this.userService.validateToken(localStorage.getItem('token') || '').pipe(
      switchMap(response => {
        if (response.valid) {
          const userId = response.user.id;
           return this.http.get<CurrencyResponse[]>(`${this.apiUrl}/${userId}/favorite-currencies`, { headers: this.getHeaders() });
        } else {
          return throwError(() => new Error('Invalid token'));
        }
      }),
        catchError(error => {
            console.error('Error fetching user wallets:', error);
            return throwError(() => error);
        })
    );
  }
}