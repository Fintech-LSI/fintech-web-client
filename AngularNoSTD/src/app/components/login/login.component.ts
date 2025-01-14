import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth/auth.service'; // Update the path as per your project structure

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false // Optional: Include your styles
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string | null = null;

  faHome = faHome;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      return; // Do nothing if the form is invalid
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe(
      (response) => {
        // Handle successful login
        this.error = null;
        localStorage.setItem('token', response.token); // Save the JWT token
        this.router.navigate(['/dashboard']); // Navigate to the dashboard or desired page
      },
      (error) => {
        // Handle login error
        this.error = error.error?.message || 'An error occurred during login.';
      }
    );
  }

  goHome(): void {
    this.router.navigate(['/']); // Navigate back to home
  }
}
