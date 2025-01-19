import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = '/api/auth';  // Adjust the URL if needed

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    console.log({ email, password }, { headers });
    return this.http.post(`${this.apiUrl}/login`, { email, password }, { headers });
  }

  register(data: { email: string; password: string; firstName: string; lastName: string }): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.apiUrl}/register`, data, { headers });
  }

  validateToken(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.apiUrl}/validate-token`, { token }, { headers });
  }

   getUserProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    // Get email from the token or user data
    const email = this.getEmailFromToken(token);

    return this.http.get<any>(`${this.apiUrl}/users/email/${email}`, { headers });
  }


  getEmailFromToken(token: string | null): string {
    if (!token) return '';

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));  // Decode JWT payload
      return payload?.email || '';
    } catch (error) {
      console.error('Error decoding or parsing the JWT token payload:', error);
      return '';
   }
  }
    getRoleFromToken(token: string | null): string {
        if (!token) return '';
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));  // Decode JWT payload
            return payload?.role || '';
       } catch (error) {
             console.error('Error decoding or parsing the JWT token payload:', error);
          return '';
        }
    }

}
