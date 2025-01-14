import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})
export class DashboardComponent implements OnInit {
  profilePictureUrl: string = '/assets/default-profile.png';
  userName: string = '';

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    const token = localStorage.getItem('token');
    if (token) {
      this.userService.validateToken(token).subscribe({
        next: (response) => {
          const { user } = response;
          this.userName = `${user.firstName} ${user.lastName}`;
          this.profilePictureUrl = user.image
            ? this.userService.getImageUrl(user.image)
            : '/assets/default-profile.png';
        },
        error: (err) => {
          console.error('Failed to load user data', err);
          // Handle error (e.g., redirect to login if token is invalid)
        }
      });
    }
  }

  logOut() {
    localStorage.removeItem('token');
    console.log('User logged out');
    this.router.navigate(['/']);
  }
}

