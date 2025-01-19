import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavGroup, NavItem } from './types/navigation';
import { UserService } from '../../services/user/user.service';
import { NotificationService } from '../../services/notification/notification.service';
import { NotificationResponse, NotificationRequest } from '../../models/notification.model';
import { Subscription } from 'rxjs';
import { EventService } from '../../services/event/event.service';
import { ManageUsersComponent } from '../../components/manage-users/manage-users.component';
import { ManageWalletsComponent } from '../../components/manage-wallets/manage-wallets.component';
import { AuthService } from '../../services/auth/auth.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})
export class DashboardComponent implements OnInit, OnDestroy {
  isSidebarCollapsed = false;
  userName = '';
    userId: number | null = null;
  profilePictureUrl: string = '/assets/none.png';
  isDarkMode = false;
    notifications: NotificationResponse[] = [];
    showNotifications = false;
    unreadNotificationCount = 0;
    user: any | null = null;
    userRole: string = '';

  private subscriptions: Subscription[] = [];

    navigation: NavGroup[] = [];

  constructor(private router: Router, private userService: UserService,private notificationService: NotificationService, private eventService: EventService, private authService: AuthService) { }

  ngOnInit() {
    this.loadUserData();
      this.subscriptions.push(
          this.eventService.event$.subscribe((event: NotificationRequest) => {
            if(event && this.user){
                this.createNotification(event, this.user);
            }
        })
      )
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateActiveState();
      });
  }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

  loadUserData() {
    const token = localStorage.getItem('token');
    if (token) {
      this.subscriptions.push(
          this.userService.validateToken(token).subscribe({
            next: (response) => {
              const { user } = response;
                this.userId = user.id;
                this.user = user;
              this.userName = `${user.firstName} ${user.lastName}`;
              this.profilePictureUrl = user.image
                ? this.userService.getImageUrl(user.image)
                : '/assets/default-profile.png';
                  this.userRole = this.authService.getRoleFromToken(token);
                 this.setupNavigation();
                 this.loadUnreadNotifications();
            },
            error: (err) => {
              console.error('Failed to load user data', err);
              // Handle error (e.g., redirect to login if token is invalid)
              this.router.navigate(['/login']); // Redirect to login on error
            }
          })
      );

    } else {
      //this.router.navigate(['/login']); // Redirect to login if no token
    }
  }
    createNotification(event: NotificationRequest, user: any){
         const notification = {
           ...event,
             recipient: `${user.firstName} ${user.lastName}`
         }
      this.notificationService.createNotification(notification).subscribe({
         next: () => {
           this.loadUnreadNotifications();
         },
          error: (err) => {
            console.error('Failed to create notification', err);
          }
     })
    }

    loadNotifications() {
      this.subscriptions.push(
         this.notificationService.getUserNotifications().subscribe({
             next: (data) => {
                 this.notifications = data;
             },
             error: (error) => {
                  console.error('Error fetching notifications:', error);
               }
          })
      );
   }

    loadUnreadNotifications() {
       this.subscriptions.push(
         this.notificationService.getUnreadNotifications().subscribe({
            next: (data) => {
                this.notifications = data;
                this.calculateUnreadNotifications();
            },
             error: (error) => {
                console.error('Error fetching unread notifications:', error);
            }
          })
        );
    }
   setupNavigation() {
       if(this.userRole === 'ADMIN') {
        this.navigation = [
          {
            title: 'Admin Tools',
            items: [
              {
                title: 'Manage Users',
                icon: 'fa-users-gear',
                path: '/dashboard/manageusers',
                isActive: false
              },
              {
                title: 'Manage Wallets',
                icon: 'fa-wallet',
                path: '/dashboard/managewallets',
                isActive: false
              },
              {
                title: 'Manage Currencies',
                icon: 'fa-exchange-alt',
                path: '/dashboard/currencies',
                isActive: false
              },
            ]
          },
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
              }
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
       } else {
          this.navigation = [
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
                      }
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

    toggleNotifications() {
        this.showNotifications = !this.showNotifications;
    }

  logOut() {
    localStorage.removeItem('token');
    console.log('User logged out');
    this.router.navigate(['/login']); // Redirect to login after logout
  }

  calculateUnreadNotifications(){
      this.unreadNotificationCount = this.notifications.filter(n => !n.read).length;
  }
}