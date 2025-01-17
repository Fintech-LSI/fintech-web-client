import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../services/wallet/wallet.service';
import { CurrencyService } from '../../services/currency/currency.service';
import { WalletResponse } from '../../models/wallet-response.model';
import { CurrencyResponse } from '../../models/currency-response.model';
import { CreateWalletRequest } from '../../models/create-wallet-request.model';
import { UpdateBalanceRequest } from '../../models/update-balance-request.model';
import { TransactionRequest } from '../../models/transaction-request.model';
import { Router } from '@angular/router';

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
    selectedWalletForUpdate: WalletResponse | null = null;
    error: string = '';

    constructor(
      private walletService: WalletService,
      private currencyService: CurrencyService,
      private router: Router
    ) { }

    ngOnInit(): void {
      this.loadWallets();
      this.loadCurrencies();
    }

    loadWallets(): void {
        this.walletService.getUserWallets().subscribe({
            next: (data) => {
                this.wallets = data;
            },
            error: (error) => {
                console.error('Error fetching wallets:', error);
                this.handleError(error);
            }
        });
    }

  loadCurrencies(): void {
    this.currencyService.getAllCurrencies().subscribe({
      next: (data) => {
        this.currencies = data;
      },
      error: (error) => {
        console.error('Error fetching currencies:', error);
        this.handleError(error);
      }
    });
  }

  createWallet(): void {
    this.walletService.createWallet(this.newWallet).subscribe({
      next: (data) => {
        this.wallets.push(data);
        this.newWallet = { userId: 0, currencyCode: '', initialBalance: 0 };
      },
      error: (error) => {
        console.error('Error creating wallet:', error);
        this.handleError(error);
      }
    });
  }

   selectWalletForUpdate(wallet: WalletResponse): void {
        this.selectedWalletForUpdate = wallet;
   }

   cancelUpdate(): void{
        this.selectedWalletForUpdate = null;
        this.updateBalance = {amount:0, currencyCode: ''}
    }


  updateWalletBalance(): void {
      if (this.selectedWalletForUpdate) {
          this.walletService.updateBalance(this.selectedWalletForUpdate.id, this.updateBalance).subscribe({
            next: (data) => {
              const index = this.wallets.findIndex(w => w.id === data.id);
              if (index !== -1) {
                this.wallets[index] = data;
              }
                this.selectedWalletForUpdate = null;
                this.updateBalance = { amount: 0, currencyCode: '' };
            },
            error: (error) => {
              console.error('Error updating wallet balance:', error);
              this.handleError(error);
            }
          });
      }
  }


    performTransaction(): void {
    this.walletService.performTransaction(this.transaction).subscribe({
      next: (data) => {
        this.loadWallets();
        this.transaction = { transactionType: '', walletId: 0, targetWalletId: 0, amount: 0, description: '', moneyMethod: '' };
      },
      error: (error) => {
        console.error('Error performing transaction:', error);
        this.handleError(error);
      }
    });
  }

  private handleError(error: any): void {
      if (error.status === 401) {
          this.error = 'You are not authorized. Please log in.';
          this.router.navigate(['/login']);
      } else {
          this.error = 'An error occurred. Please try again later.';
      }
  }
}