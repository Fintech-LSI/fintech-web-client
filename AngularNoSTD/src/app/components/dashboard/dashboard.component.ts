import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavGroup, NavItem } from './types/navigation'; // Corrected import path
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})
export class DashboardComponent implements OnInit {
  isSidebarCollapsed = false;
  userName = '';
  profilePictureUrl: string = '/assets/none.png';
  isDarkMode = false;

  navigation: NavGroup[] = [
    {
      title: 'Overview',
      items: [
        {
          title: 'Dashboard',
          icon: 'fa-tachometer-alt',
          path: '/dashboard/portfolio',
          isActive: false
        },
        {
          title: 'Analytics',
          icon: 'fa-chart-line',
          path: '/dashboard/stocks',
          isActive: false
        }
      ]
    },
    {
      title: 'Finance',
      items: [
        {
          title: 'Wallet',
          icon: 'fa-wallet',
          path: '/dashboard/wallet',
          isActive: false
        },
        {
          title: 'Currencies (ADMIN)',
          icon: 'fa-exchange-alt',
          path: '/dashboard/currencies',
          isActive: false
        },
        {
          title: 'Loan',
          icon: 'fa-solid fa-coins',
          path: '/dashboard/loan',
          isActive: false
        },
        {
          title: 'Loan Manager',
          icon: 'fa-solid fa-money-bills',
          path: '/dashboard/loan-manager',
          isActive: false
        },
        {
          title: 'Fav Currencies',
          icon: 'fa-exchange-alt',
          path: '/dashboard/favcurrency',
          isActive: false
        },
      ]
    },
    {
      title: 'AI & Reports',
      items: [
        {
          title: 'Predictions',
          icon: 'fa-robot',
          path: '/dashboard/predictions',
          isActive: false
        },
        {
          title: 'Activity',
          icon: 'fa-file-invoice',
          path: '/dashboard/activity',
          isActive: false
        }
      ]
    },
    {
      title: 'Account',
      items: [
        {
          title: 'Settings',
          icon: 'fa-cog',
          path: '/dashboard/profile',
          isActive: false
        },
        {
          title: 'Log Out',
          icon: 'fa-sign-out-alt',
          path: '/login', // Updated to use /login instead of /logout
          isActive: false
        }
      ]
    }
  ];


  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.loadUserData();
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateActiveState();
      });
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
          this.router.navigate(['/login']); // Redirect to login on error
        }
      });
    } else {
      //this.router.navigate(['/login']); // Redirect to login if no token
    }
  }


  private updateActiveState() {
    this.navigation.forEach(group => {
      group.items.forEach((item: NavItem) => { // Added explicit type for 'item'
        item.isActive = this.router.url === item.path;
      });
    });
  }


  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle('dark');
  }

  logOut() {
    localStorage.removeItem('token');
    console.log('User logged out');
    this.router.navigate(['/login']); // Redirect to login after logout
  }
}
