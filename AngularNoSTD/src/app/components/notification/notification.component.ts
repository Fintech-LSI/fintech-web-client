import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from '../../services/notification/notification.service';
import { NotificationResponse } from '../../models/notification.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  standalone: false,
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: NotificationResponse[] = [];
  isLoading = true;
  private subscriptions: Subscription[] = [];

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.loadNotifications();
  }

  ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }


    loadNotifications(): void {
       this.isLoading = true;
      this.subscriptions.push(
          this.notificationService.getUnreadNotifications().subscribe({
            next: (data) => {
               this.notifications = data;
               this.isLoading = false;
            },
            error: (error) => {
               console.error('Error fetching notifications:', error);
               this.isLoading = false;
            }
          })
      );
    }

   markAsRead(notificationId: number) {
       this.subscriptions.push(
            this.notificationService.markAsRead(notificationId).subscribe({
               next: (notification) => {
                   this.notifications = this.notifications.map(n => {
                       if(n.id === notification.id) {
                           return {...n, read: true};
                       }
                       return n
                   });
               },
               error: (error) => {
                    console.error('Error marking as read:', error);
               }
            })
       );
   }


    deleteNotification(notificationId: number) {
       this.subscriptions.push(
           this.notificationService.deleteNotification(notificationId).subscribe({
              next: () => {
                   this.notifications = this.notifications.filter(n => n.id !== notificationId);
              },
              error: (error) => {
                console.error('Error deleting notification:', error);
              }
          })
       );
    }
}