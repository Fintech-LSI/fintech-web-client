import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private authUrl = 'http://a9761a9b3f8034259b6153cee04be721-959097204.us-east-1.elb.amazonaws.com:8222/api/auth';
  private userUrl = 'http://a9761a9b3f8034259b6153cee04be721-959097204.us-east-1.elb.amazonaws.com:8222/api/users';
  private imgUrl = 'http://a9761a9b3f8034259b6153cee04be721-959097204.us-east-1.elb.amazonaws.com:8222/users/public/images';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Validate token and get user info
  validateToken(token: string): Observable<any> {
    return this.http.post(`${this.authUrl}/validate-token`, { token });
  }

  // Get user by email (for profile data)
  getUserByEmail(email: string): Observable<any> {
    return this.http.get(`${this.userUrl}/email/${email}`, { headers: this.getHeaders() });
  }

  // Get user by ID
  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.userUrl}/${id}`,{ headers: this.getHeaders() })
  }

  // Update user profile
  updateProfile(id: number, data: any): Observable<any> {
    return this.http.put(`${this.userUrl}/${id}`, data, { headers: this.getHeaders() });
  }

  // Update user profile picture
  updateProfilePicture(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('imageFile', file);
    return this.http.patch(`${this.userUrl}/${id}`, formData, { headers: this.getHeaders() });
  }

  // Get image URL (public access)
  getImageUrl(filename: string): string {
    return `${this.imgUrl}/${filename}`;
  }
}

