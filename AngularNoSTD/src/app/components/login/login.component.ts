import { Component } from '@angular/core';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  faHome = faHome;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  goHome() {
    this.router.navigate(['/']); // Navigates to the home route
  }

  onLogin() {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        // Save JWT in localStorage or sessionStorage
        localStorage.setItem('authToken', response.token);

        // Redirect to dashboard or home page
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        alert(`Login failed: ${err.error.message || err.message}`);
      }
    });
  }
}
