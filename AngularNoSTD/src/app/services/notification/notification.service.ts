import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NotificationResponse, NotificationRequest } from '../../models/notification.model';
import { UserService } from '../user/user.service';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `http://localhost:8222/api/notifications`;

  constructor(private http: HttpClient, private userService: UserService) { }

   createNotification(notification: NotificationRequest): Observable<NotificationResponse> {
       return this.http.post<NotificationResponse>(this.apiUrl, notification);
    }

     getUserNotifications(): Observable<NotificationResponse[]> {
          return this.userService.validateToken(localStorage.getItem('token') || '').pipe(
              switchMap(response => {
                  if (response.valid && response.user) {
                      const userId = response.user.id;
                      return this.http.get<NotificationResponse[]>(`${this.apiUrl}/user/${userId}`);
                  } else {
                      return throwError(() => new Error('Invalid token'))
                  }
              })
          );
      }

    getUnreadNotifications(): Observable<NotificationResponse[]> {
      return this.userService.validateToken(localStorage.getItem('token') || '').pipe(
         switchMap(response => {
           if(response.valid && response.user){
             const userId = response.user.id;
            return this.http.get<NotificationResponse[]>(`${this.apiUrl}/user/${userId}/unread`);
           } else{
             return throwError(() => new Error('Invalid token'))
           }
         })
      )
    }

    markAsRead(notificationId: number): Observable<NotificationResponse> {
      return this.http.post<NotificationResponse>(`${this.apiUrl}/${notificationId}/read`,{});
    }

    deleteNotification(notificationId: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${notificationId}`);
    }
    getAllNotifications(): Observable<NotificationResponse[]> {
        return this.http.get<NotificationResponse[]>(this.apiUrl);
    }
}