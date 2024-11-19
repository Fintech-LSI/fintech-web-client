import { Component } from '@angular/core';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  faHome = faHome;

  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']); // Navigates to the home route
  }

}
