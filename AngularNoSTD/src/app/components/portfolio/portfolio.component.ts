import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from '../../services/notification/notification.service';
import { WalletService } from '../../services/wallet/wallet.service';
import { UserService } from '../../services/user/user.service';
import { NotificationResponse } from '../../models/notification.model';
import { WalletResponse } from '../../models/wallet-response.model';
import { Subject, takeUntil } from 'rxjs';
import { TransactionService } from '../../services/transaction/transaction.service';

@Component({
    selector: 'app-portfolio',
    templateUrl: './portfolio.component.html',
    styleUrl: './portfolio.component.scss',
    standalone: false
})
export class PortfolioComponent implements OnInit, OnDestroy {
    latestNotifications: NotificationResponse[] = [];
    currentBalance: number = 0;
    monthlyIncome: number | string = 'None';
     employmentMonths: number | string = 'None';
    private destroy$ = new Subject<void>();
    constructor(
        private notificationService: NotificationService,
        private walletService: WalletService,
        private userService: UserService,
        private transactionService: TransactionService
    ) { }

    ngOnInit(): void {
        this.loadData();
        this.loadEmploymentMonths();
    }
    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }

    loadData(): void {
        this.loadNotifications();
        this.loadWallets();
        this.loadUserProfile();
    }
  loadEmploymentMonths(): void {
      this.userService.validateToken(localStorage.getItem('token') || '').pipe(takeUntil(this.destroy$)).subscribe(
          response => {
              if(response.valid && response.user){
                  const { employmentMonth } = response.user;
                  this.employmentMonths = employmentMonth !== null ? employmentMonth : 'None';
              }
          }
      );
  }
    loadUserProfile(): void {
        this.userService.validateToken(localStorage.getItem('token') || '').pipe(takeUntil(this.destroy$)).subscribe(
            response => {
                if(response.valid && response.user){
                    const {salary} = response.user;
                    this.monthlyIncome = salary !== null ?  salary : 'None';
                }
            }
        )
    }
    loadNotifications(): void {
        this.notificationService.getUserNotifications()
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (notifications) => {
                    this.latestNotifications = notifications.slice(0, 3);
                },
                (error) => {
                    console.error('Error fetching notifications:', error);
                }
            );
    }

    loadWallets(): void {
        this.walletService.getUserWallets().subscribe({
            next: (wallets) => {
                this.currentBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
            },
            error: (error) => {
                console.error('Error fetching wallets:', error);
            }
        });
    }
}