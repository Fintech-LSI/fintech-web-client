import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../services/wallet/wallet.service';
import { CurrencyService } from '../../services/currency/currency.service';
import { WalletResponse } from '../../models/wallet-response.model';
import { CurrencyResponse } from '../../models/currency-response.model';
import { CreateWalletRequest } from '../../models/create-wallet-request.model';
import { UpdateBalanceRequest } from '../../models/update-balance-request.model';
import { TransactionRequest } from '../../models/transaction-request.model';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
  standalone: false
})
export class WalletComponent implements OnInit {
  wallets: WalletResponse[] = [];
  currencies: CurrencyResponse[] = [];
  newWallet: CreateWalletRequest = { userId: 0, currencyCode: '', initialBalance: 0 };
  updateBalance: UpdateBalanceRequest = { amount: 0, currencyCode: '' };
  transaction: TransactionRequest = { transactionType: '', walletId: 0, targetWalletId: 0, amount: 0, description: '', moneyMethod: '' };

  constructor(
    private walletService: WalletService,
    private currencyService: CurrencyService
  ) { }

  ngOnInit(): void {
    this.loadWallets();
    this.loadCurrencies();
  }

  loadWallets(): void {
    // Implement this method to fetch wallets from the backend
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

  createWallet(): void {
    this.walletService.createWallet(this.newWallet).subscribe(
      (data) => {
        this.wallets.push(data);
        this.newWallet = { userId: 0, currencyCode: '', initialBalance: 0 };
      },
      (error) => {
        console.error('Error creating wallet:', error);
      }
    );
  }

  updateWalletBalance(walletId: number): void {
    this.walletService.updateBalance(walletId, this.updateBalance).subscribe(
      (data) => {
        const index = this.wallets.findIndex(w => w.id === data.id);
        if (index !== -1) {
          this.wallets[index] = data;
        }
        this.updateBalance = { amount: 0, currencyCode: '' };
      },
      (error) => {
        console.error('Error updating wallet balance:', error);
      }
    );
  }

  performTransaction(): void {
    this.walletService.performTransaction(this.transaction).subscribe(
      (data) => {
        // Handle the transaction result
        this.loadWallets(); // Reload wallets to reflect changes
        this.transaction = { transactionType: '', walletId: 0, targetWalletId: 0, amount: 0, description: '', moneyMethod: '' };
      },
      (error) => {
        console.error('Error performing transaction:', error);
      }
    );
  }
}

