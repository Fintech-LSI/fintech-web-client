import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotificationRequest } from '../../models/notification.model';
import { EventService } from '../event/event.service';

interface UserValidationResponse {
    valid: boolean;
    user?: any;
    role?: string;
}

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private authUrl = '/api/auth';
    private userUrl = '/api/users';
    private imgUrl = '/users/public/images';
    userId: number | null = null;
    constructor(private http: HttpClient, private router: Router, private eventService: EventService) { }

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }

    // Validate token and get user info
   validateToken(token: string): Observable<UserValidationResponse> {
        return this.http.post<UserValidationResponse>(`${this.authUrl}/validate-token`, { token }).pipe(
            switchMap((response) => {
                if (response.valid && response.user) {
                    this.userId = response.user.id;
                    return of(response);
                } else {
                    this.router.navigate(['/login']);
                    return throwError(() => new Error('Invalid token'));
                }
            }),
            catchError(error => {
                console.error('Token validation failed:', error);
                this.router.navigate(['/login']);
                return throwError(() => error);
            })
        );
    }

    // Get user by email (for profile data)
    getUserByEmail(email: string): Observable<any> {
        return this.http.get(`${this.userUrl}/email/${email}`, { headers: this.getHeaders() });
    }

    // Get user by ID
    getUserById(id: number): Observable<any> {
        return this.http.get(`${this.userUrl}/${id}`, { headers: this.getHeaders() });
    }
    getAllUsers(): Observable<any> {
       return this.http.get(this.userUrl, {headers: this.getHeaders()});
    }

     createUser(data: any): Observable<any> {
         return this.http.post(this.userUrl, data, {headers: this.getHeaders()}).pipe(
           tap(() => {
             const event: NotificationRequest = {
               userId: 0,
               recipient: '',
               message: `Created user.`,
               timestamp: new Date().toISOString(),
             };
               this.eventService.emit(event);
           })
         )
    }
    // Update user profile
    updateProfile(id: number, data: any): Observable<any> {
        return this.http.put(`${this.userUrl}/${id}`, data, { headers: this.getHeaders() }).pipe(
            tap(() => {
                const event: NotificationRequest = {
                    userId: id,
                    recipient: '',
                    message: `Updated your profile settings.`,
                    timestamp: new Date().toISOString(),
                };
                this.eventService.emit(event);
            })
        );
    }
  deleteUser(id: number): Observable<any> {
       return this.http.delete(`${this.userUrl}/${id}`,{ headers: this.getHeaders() }).pipe(
            tap(() => {
               const event: NotificationRequest = {
                 userId: id,
                 recipient: '',
                 message: `Deleted user with id ${id}.`,
                   timestamp: new Date().toISOString(),
               };
              this.eventService.emit(event);
           })
      );
  }

    // Update user profile picture
     updateProfilePicture(id: number, file: File): Observable<any> {
      const formData = new FormData();
      formData.append('imageFile', file);
      return this.http.patch(`${this.userUrl}/${id}`, formData, { headers: this.getHeaders() }).pipe(
            tap(() => {
               const event: NotificationRequest = {
                 userId: id,
                 recipient: '',
                 message: `Updated your profile picture.`,
                 timestamp: new Date().toISOString(),
              };
             this.eventService.emit(event);
         })
      );
     }
    // Get image URL (public access)
    getImageUrl(filename: string): string {
        return `${this.imgUrl}/${filename}`;
    }
}
