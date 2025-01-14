import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: false
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  profilePictureUrl: string = '/assets/default-profile.png';
  loading: boolean = false;
  error: string | null = null;
  userId!: number;
  darkMode: boolean = false;
  isEditMode: boolean = false; // Added: edit mode control

  financialOverview = {
    currentBalance: 12450.75,
    preferredCurrency: 'USD',
    favoriteCoin: 'Bitcoin (BTC)',
    accountType: 'Premium'
  };

  constructor(private userService: UserService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.validateAndLoadProfile();
    this.checkDarkMode();
  }

  initForm(): void {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['USER'], // Default to USER
      age: ['', [Validators.required, Validators.min(18), Validators.max(120)]],
      salary: ['', [Validators.required, Validators.min(0)]],
      homeOwnership: ['OWN'], // Default to OWN
      employmentMonth: ['', [Validators.required, Validators.min(0)]],
    });
  }

  validateAndLoadProfile(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        this.error = 'No token found. Please log in.';
        return;
      }

      this.loading = true;
      this.userService.validateToken(token).subscribe({
        next: (response) => {
          const { user, role } = response;
          const { id, firstName, lastName, email, image, age, salary, homeOwnership, employmentMonth } = user;
          this.userId = id;
          this.profileForm.patchValue({
            firstName,
            lastName,
            email,
            role,
            age,
            salary,
            homeOwnership,
            employmentMonth,
          });
          this.profilePictureUrl = image
            ? this.userService.getImageUrl(image)
            : '/assets/default-profile.png';
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to validate token or load profile data.';
          console.error(err);
          this.loading = false;
        },
      });
    } else {
      this.error = 'Local storage is not available.';
    }
  }

  onSaveChanges(): void {
    if (this.profileForm.valid) {
      this.loading = true;
      const updatedProfile = {
        ...this.profileForm.value,
        homeOwnership: this.profileForm.get('homeOwnership')?.value,
        role: this.profileForm.get('role')?.value.toUpperCase()
      };
      console.log('Sending updated profile:', updatedProfile); // Add this line
      this.userService.updateProfile(this.userId, updatedProfile).subscribe({
        next: () => {
          alert('Profile updated successfully!');
          this.loading = false;
          this.isEditMode = false;
        },
        error: (err) => {
          this.error = 'Failed to update profile. Please check your input and try again.';
          console.error('Error updating profile:', err); // Update this line
          this.loading = false;
        },
      });
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.userService.uploadProfilePicture(file).subscribe({
        next: (response) => {
          this.profilePictureUrl = this.userService.getImageUrl(response.filename);
          alert('Profile picture updated successfully!');
        },
        error: (err) => {
          this.error = 'Failed to upload profile picture.';
          console.error(err);
        },
      });
    }
  }

  checkDarkMode(): void {
    this.darkMode = document.body.classList.contains('dark-mode');
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark-mode', this.darkMode);
  }

  toggleEditMode(): void { // Added: toggle edit mode method
    this.isEditMode = !this.isEditMode;
  }
}

