import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { WalletResponse } from '../../models/wallet-response.model';
import { CreateWalletRequest } from '../../models/create-wallet-request.model';
import { UpdateBalanceRequest } from '../../models/update-balance-request.model';
import { TransactionRequest } from '../../models/transaction-request.model';
import { UserService } from '../user/user.service';
import { NotificationRequest } from '../../models/notification.model';
import { EventService } from '../event/event.service';

@Injectable({
    providedIn: 'root'
})
export class WalletService {
    private apiUrl = 'http://abb887b0c62ca480fb7bc67a5a1408f3-631602432.us-east-1.elb.amazonaws.com:8222/api/wallets';

    constructor(private http: HttpClient, private userService: UserService, private eventService: EventService) { }

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
            tap((createdWallet) => {
                const event: NotificationRequest = {
                    userId: createdWallet.userId,
                    recipient: '',
                    message: `Created wallet with id: ${createdWallet.id} and currency ${createdWallet.currencyCode}`,
                    timestamp: new Date().toISOString(),
                };
                this.eventService.emit(event);
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
    getAllWallets(): Observable<WalletResponse[]> {
        return this.http.get<WalletResponse[]>(`${this.apiUrl}`, { headers: this.getHeaders() });
    }
    deleteWallet(walletId: number): Observable<WalletResponse> {
        return this.http.delete<WalletResponse>(`${this.apiUrl}/${walletId}`, { headers: this.getHeaders() }).pipe(
            tap(() => {
                const event: NotificationRequest = {
                    userId: 0,
                    recipient: '',
                    message: `Deleted wallet with id: ${walletId}.`,
                    timestamp: new Date().toISOString(),
                };
                this.eventService.emit(event);
            })
        );
    }

    updateBalance(id: number, request: UpdateBalanceRequest): Observable<WalletResponse> {
        return this.http.put<WalletResponse>(`${this.apiUrl}/${id}/balance`, request, { headers: this.getHeaders() }).pipe(
            tap((updatedWallet) => {
                const event: NotificationRequest = {
                    userId: updatedWallet.userId,
                    recipient: '',
                    message: `Updated balance of wallet with id: ${updatedWallet.id} to ${updatedWallet.balance}`,
                    timestamp: new Date().toISOString(),
                };
                this.eventService.emit(event);
            })
        );
    }

    getUserWallets(): Observable<WalletResponse[]> {
        return this.userService.validateToken(localStorage.getItem('token') || '').pipe(
            switchMap(response => {
                if (response.valid) {
                    const userId = response.user.id;
                    return this.http.get<WalletResponse[]>(`${this.apiUrl}/user/${userId}`, { headers: this.getHeaders() });
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

    performTransaction(request: TransactionRequest): Observable<WalletResponse> {
          return this.userService.validateToken(localStorage.getItem('token') || '').pipe(
            switchMap(response => {
              if (response.valid) {
                if(request.transactionType === 'DEPOSIT'){
                  return this.http.post<WalletResponse>(`${this.apiUrl}/deposit`, {...request, walletId: request.walletId}, { headers: this.getHeaders() });
                }
                if(request.transactionType === 'TRANSFER'){
                  return this.http.post<WalletResponse>(`${this.apiUrl}/transfer`, {...request,  walletId: request.walletId, targetWalletId: request.targetWalletId  }, { headers: this.getHeaders() });
                }
                if(request.transactionType === 'WITHDRAW'){
                  return this.http.post<WalletResponse>(`${this.apiUrl}/withdraw`,{...request, walletId: request.walletId  }, { headers: this.getHeaders() });
                }
                 return throwError(() => new Error('Invalid transaction type'));
             } else {
                return throwError(() => new Error('Invalid token'));
             }
            }),
          tap((transactionResult) => {
               const event: NotificationRequest = {
                 userId: request.walletId,
                recipient: '',
                message: `Performed ${request.transactionType} transaction of ${request.amount} in wallet: ${request.walletId}`,
                timestamp: new Date().toISOString(),
                };
               this.eventService.emit(event);
          })
      );
    }
}
