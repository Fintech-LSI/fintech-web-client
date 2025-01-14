import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WalletResponse } from '../../models/wallet-response.model';
import { CreateWalletRequest } from '../../models/create-wallet-request.model';
import { UpdateBalanceRequest } from '../../models/update-balance-request.model';
import { TransactionRequest } from '../../models/transaction-request.model';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private apiUrl = 'http://localhost:8080/api/wallets'; // Adjust this URL as needed

  constructor(private http: HttpClient) { }

  createWallet(request: CreateWalletRequest): Observable<WalletResponse> {
    return this.http.post<WalletResponse>(this.apiUrl, request);
  }

  getWallet(id: number): Observable<WalletResponse> {
    return this.http.get<WalletResponse>(`${this.apiUrl}/${id}`);
  }

  updateBalance(id: number, request: UpdateBalanceRequest): Observable<WalletResponse> {
    return this.http.put<WalletResponse>(`${this.apiUrl}/${id}/balance`, request);
  }

  performTransaction(request: TransactionRequest): Observable<WalletResponse> {
    return this.http.post<WalletResponse>(`${this.apiUrl}/transaction`, request);
  }
}

