import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faHome } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  
  faHome = faHome;

  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']); // Navigates to the home route
  }
}
