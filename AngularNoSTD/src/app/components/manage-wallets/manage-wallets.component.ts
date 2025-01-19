import { Component, OnInit, OnDestroy } from '@angular/core';
import { WalletService } from '../../services/wallet/wallet.service';
import { UserService } from '../../services/user/user.service';
import { Subscription } from 'rxjs';
import { CurrencyService } from '../../services/currency/currency.service';
import { CurrencyResponse } from '../../models/currency-response.model';
import { CreateWalletRequest } from '../../models/create-wallet-request.model';
@Component({
  selector: 'app-manage-wallets',
  templateUrl: './manage-wallets.component.html',
  styleUrls: ['./manage-wallets.component.scss'],
  standalone: false,
})
export class ManageWalletsComponent implements OnInit, OnDestroy {
  wallets: any[] = [];
    users: any[] = [];
    currencies: CurrencyResponse[] = [];
    selectedWallet: any = { };
    isModalOpen: boolean = false;
    isEditMode: boolean = false;
    error: string | null = null;
    loading: boolean = false;
    private subscriptions: Subscription[] = [];
    newWallet: CreateWalletRequest = { userId: 0, currencyCode: '', initialBalance: 0 };


  constructor(private walletService: WalletService, private userService: UserService, private currencyService: CurrencyService) { }

  ngOnInit(): void {
        this.loadWallets();
        this.loadCurrencies();
    this.loadUsers();
  }
     ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
  loadWallets() {
     this.loading = true;
        this.subscriptions.push(
          this.walletService.getAllWallets().subscribe({
            next: (wallets) => {
                this.wallets = wallets;
                this.loading = false;
             },
            error: (err) => {
               this.error = 'Failed to load wallets.';
               console.error('Error loading wallets:', err);
               this.loading = false;
            }
          })
        );
  }
 loadUsers() {
        this.subscriptions.push(
            this.userService.getAllUsers().subscribe({
               next: (users) => {
                  this.users = users;
               },
               error: (err) => {
                 console.error('Error loading users:', err);
               }
          })
        );
   }

 loadCurrencies(): void {
       this.subscriptions.push(
            this.currencyService.getAllCurrencies().subscribe({
               next: (data) => {
                 this.currencies = data;
                },
                error: (error) => {
                 console.error('Error fetching currencies:', error);
               }
           })
        );
 }
  createWallet(): void{
    this.isModalOpen = true;
    this.isEditMode = false;
     this.selectedWallet = {
      userId: null,
      currencyCode: null,
      initialBalance: null
     }
  }
  editWallet(wallet: any): void{
      this.isModalOpen = true;
      this.isEditMode = true;
      this.selectedWallet = { ...wallet};
  }
 deleteWallet(walletId: number){
      this.loading = true;
       this.subscriptions.push(
        this.walletService.deleteWallet(walletId).subscribe({
            next: () => {
                 this.loadWallets();
                 this.loading = false;
               },
              error: (err) => {
                   this.error = 'Failed to delete wallet.';
                   console.error('Error deleting wallet:', err);
                   this.loading = false;
               }
         })
       );
  }
  closeModal(): void{
      this.isModalOpen = false;
      this.selectedWallet = {};
  }
  saveWallet(){
     this.loading = true;
      if(this.isEditMode){
           this.subscriptions.push(
                this.walletService.updateBalance(this.selectedWallet.id, {amount: this.selectedWallet.balance, currencyCode: this.selectedWallet.currencyCode}).subscribe({
                    next: () => {
                        this.loadWallets();
                        this.closeModal();
                      this.loading = false;
                    },
                    error: (err) => {
                      this.error = 'Failed to update wallet.';
                       console.error('Error updating wallet:', err);
                      this.loading = false;
                     }
                 })
           );
      } else {
          this.subscriptions.push(
            this.walletService.createWallet(this.selectedWallet).subscribe({
                 next: () => {
                   this.loadWallets();
                    this.closeModal();
                     this.loading = false;
                   },
                   error: (err) => {
                     this.error = 'Failed to create wallet.';
                     console.error('Error creating wallet:', err);
                    this.loading = false;
                   }
              })
          );
      }
    }
}