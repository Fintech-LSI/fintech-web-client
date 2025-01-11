import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  constructor(private router: Router) {}

  b : boolean = false ;

  logOut() {
    // Clear authentication details from localStorage
    localStorage.removeItem('authToken'); // Replace 'authToken' with your key for the token
    localStorage.removeItem('user'); // If you store additional user info, clear it too
  
    // Log out message
    console.log('User logged out');
  
    // Redirect to login page
    this.router.navigate(['/']);
  }

}
