import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from '../../services/notification/notification.service';
import { NotificationResponse } from '../../models/notification.model';
import { Subject, takeUntil } from 'rxjs';

interface ExtendedNotificationResponse extends NotificationResponse {
    type?: string;
    amount?: number;
}

@Component({
    selector: 'app-activity',
    templateUrl: './activity.component.html',
    styleUrl: './activity.component.scss',
    standalone: false
})
export class ActivityComponent implements OnInit, OnDestroy {
    allNotifications: ExtendedNotificationResponse[] = [];
    notifications: ExtendedNotificationResponse[] = [];
    filterType: string = 'all';
    filterDate: string = 'all';
    searchText: string = '';
    private destroy$ = new Subject<void>();

    constructor(private notificationService: NotificationService) { }

    ngOnInit(): void {
        this.loadNotifications();
    }
      ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
      }
    loadNotifications(): void {
        this.notificationService
            .getUserNotifications()
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (notifications) => {
                    this.allNotifications = notifications.map(notification => {
                        return {...notification, type: this.getTypeFromMessage(notification.message), amount: this.getAmountFromMessage(notification.message)}
                    }) ;
                    this.filterNotifications();
                },
                (error) => {
                    console.error('Error fetching notifications:', error);
                }
            );
    }

    onFilterChange(event: Event): void {
        const selectElement = event.target as HTMLSelectElement;
      if(selectElement.parentElement?.parentElement?.children[1] === event.target)
        {
          this.filterType = selectElement.value;
        } else {
            this.filterDate = selectElement.value;
        }
        this.filterNotifications();
    }

    onSearchChange(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        this.searchText = inputElement.value;
        this.filterNotifications();
    }

    onLoadMore(): void {
        // TODO: Implement load more logic
        console.log('load more');
    }
    getTypeFromMessage(message: string): string {
        if (message.toLowerCase().includes('payment')) {
            return 'payment';
        }
        else if (message.toLowerCase().includes('deposit')) {
            return 'deposit';
        }
        else if (message.toLowerCase().includes('withdrawal')) {
            return 'withdrawal';
        }
        return 'other'
    }
    getAmountFromMessage(message: string): number {
        const amountMatch = message.match(/[-+]?\$?(\d+\.?\d*)/);
        return amountMatch ? parseFloat(amountMatch[1]) : 0;
    }
    filterNotifications(): void {
        this.notifications = [...this.allNotifications];

        //filter by type
        if (this.filterType !== 'all') {
            this.notifications = this.notifications.filter((notification) => notification.type === this.filterType);
        }
        // Filter by date
        if (this.filterDate !== 'all') {
            const now = new Date();
            let filterDate = new Date();
            if (this.filterDate === 'last7days') {
                filterDate.setDate(now.getDate() - 7);
            }
            else if (this.filterDate === 'last30days') {
                filterDate.setDate(now.getDate() - 30);
            }

            this.notifications = this.notifications.filter(notification => {
                const notificationDate = new Date(notification.timestamp);
                return notificationDate >= filterDate;
            });
        }
        //filter by search text
        if (this.searchText) {
            const searchTerm = this.searchText.toLowerCase();
            this.notifications = this.notifications.filter(notification =>
                notification.message.toLowerCase().includes(searchTerm)
            );
        }
        // sort by timestamp descending
        this.notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    }
}