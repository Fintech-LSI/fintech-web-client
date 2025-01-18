import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { CurrencyResponse } from '../../models/currency-response.model';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class FavoriteCurrencyService {
  private apiUrl = 'http://gateway-service:8222/api/users';

  constructor(private http: HttpClient, private userService: UserService) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error) {
        errorMessage += `\nDetails: ${JSON.stringify(error.error)}`;
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  addFavoriteCurrency(currencyId: number): Observable<CurrencyResponse> {
    return this.userService.validateToken(localStorage.getItem('token') || '').pipe(
      switchMap(response => {
        if(response.valid){
          const userId = response.user.id;
          console.log(`Adding favorite currency ${currencyId} for user ${userId}`);
          return this.http.post<CurrencyResponse>(`${this.apiUrl}/${userId}/favorite-currencies/${currencyId}`, {}, { headers: this.getHeaders() });
        } else {
          return throwError(() => new Error('Invalid token'));
        }
      }),
      tap(response => console.log('Add favorite currency response:', response)),
      catchError(this.handleError)
    );
  }

  removeFavoriteCurrency(currencyId: number): Observable<void> {
    return this.userService.validateToken(localStorage.getItem('token') || '').pipe(
      switchMap(response => {
        if(response.valid) {
          const userId = response.user.id;
          console.log(`Removing favorite currency ${currencyId} for user ${userId}`);
          return this.http.delete<void>(`${this.apiUrl}/${userId}/favorite-currencies/${currencyId}`, { headers: this.getHeaders() });
        } else {
          return throwError(() => new Error('Invalid token'));
        }
      }),
      tap(() => console.log('Remove favorite currency successful')),
      catchError(this.handleError)
    );
  }

  getUserFavoriteCurrencies(): Observable<CurrencyResponse[]> {
    return this.userService.validateToken(localStorage.getItem('token') || '').pipe(
      switchMap(response => {
        if (response.valid) {
          const userId = response.user.id;
          console.log(`Fetching favorite currencies for user ${userId}`);
          return this.http.get<CurrencyResponse[]>(`${this.apiUrl}/${userId}/favorite-currencies`, { headers: this.getHeaders() });
        } else {
          return throwError(() => new Error('Invalid token'));
        }
      }),
      tap(favorites => console.log('Fetched favorite currencies:', favorites)),
      catchError(this.handleError)
    );
  }
}

