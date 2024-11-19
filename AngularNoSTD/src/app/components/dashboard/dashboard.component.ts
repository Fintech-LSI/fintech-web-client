import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  constructor(private router: Router) {}

  logOut() {
    // Perform any necessary cleanup like clearing tokens, user data, etc.
    console.log('User logged out');
    // Redirect to login page
    this.router.navigate(['/login']);
  }
}
