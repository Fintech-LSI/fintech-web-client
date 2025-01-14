import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { WalletResponse } from '../../models/wallet-response.model';
import { CreateWalletRequest } from '../../models/create-wallet-request.model';
import { UpdateBalanceRequest } from '../../models/update-balance-request.model';
import { TransactionRequest } from '../../models/transaction-request.model';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private apiUrl = 'http://localhost:8222/api/wallets';

  constructor(private http: HttpClient, private userService: UserService) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  createWallet(request: CreateWalletRequest): Observable<WalletResponse> {
    return this.userService.validateToken(localStorage.getItem('token') || '').pipe(
      switchMap(response => {
        if (response.valid) {
          request.userId = response.user.id;
          return this.http.post<WalletResponse>(this.apiUrl, request, { headers: this.getHeaders() });
        } else {
          return throwError(() => new Error('Invalid token'));
        }
      }),
      catchError(error => {
        console.error('Error creating wallet:', error);
        return throwError(() => error);
      })
    );
  }

  getWallet(id: number): Observable<WalletResponse> {
    return this.http.get<WalletResponse>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  updateBalance(id: number, request: UpdateBalanceRequest): Observable<WalletResponse> {
    return this.http.put<WalletResponse>(`${this.apiUrl}/${id}/balance`, request, { headers: this.getHeaders() });
  }

  performTransaction(request: TransactionRequest): Observable<WalletResponse> {
    return this.http.post<WalletResponse>(`${this.apiUrl}/transaction`, request, { headers: this.getHeaders() });
  }

  getUserWallets(): Observable<WalletResponse[]> {
    return this.userService.validateToken(localStorage.getItem('token') || '').pipe(
      switchMap(response => {
        if (response.valid) {
          return this.http.get<WalletResponse[]>(`${this.apiUrl}`, { headers: this.getHeaders() });
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

  getCurrentWallets(): Observable<WalletResponse[]> {
    return this.userService.validateToken(localStorage.getItem('token') || '').pipe(
      switchMap(response => {
        if (response.valid) {
          const userId = response.user.id; // Extract the userId from the response
          return this.http.get<WalletResponse[]>(`${this.apiUrl}?userId=${userId}`, { headers: this.getHeaders() });
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
  

  deposit(request: TransactionRequest): Observable<WalletResponse> {
    return this.http.post<WalletResponse>(`${this.apiUrl}/deposit`, request, { headers: this.getHeaders() });
  }
}

