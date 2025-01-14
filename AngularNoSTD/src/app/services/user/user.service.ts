import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private authUrl = 'http://localhost:8222/api/auth';
  private userUrl = 'http://localhost:8222/api/users';
  private imgUrl = 'http://localhost:8222/users/public';

  constructor(private http: HttpClient) {}

  // Validate token and get user info
  validateToken(token: string): Observable<any> {
    return this.http.post(`${this.authUrl}/validate-token`, { token });
  }

  // Get user by email (for profile data)
  getUserByEmail(email: string): Observable<any> {
    return this.http.get(`${this.userUrl}/email/${email}`);
  }

  // Update user profile
  updateProfile(id: number, data: { firstName: string; lastName: string; email: string }): Observable<any> {
    return this.http.put(`${this.userUrl}/${id}`, data);
  }

  // Upload profile picture
  uploadProfilePicture(file: File): Observable<any> {
    const headers = new HttpHeaders();
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.userUrl}/upload-image`, formData, { headers });
  }

  // Get image URL (public access)
  getImageUrl(filename: string): string {
    return `${this.imgUrl}${filename}`;
  }
}
