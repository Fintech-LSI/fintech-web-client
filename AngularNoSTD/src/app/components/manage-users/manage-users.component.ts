import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss'],
  standalone: false
})
export class ManageUsersComponent implements OnInit, OnDestroy {
    users: any[] = [];
    selectedUser: any = { };
    isModalOpen: boolean = false;
    isEditMode: boolean = false;
    error: string | null = null;
    loading: boolean = false;
    private subscriptions: Subscription[] = [];

    constructor(private userService: UserService) { }

    ngOnInit(): void {
        this.loadUsers();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }


    loadUsers() {
        this.loading = true;
        this.subscriptions.push(
            this.userService.getAllUsers().subscribe({
                next: (users) => {
                  this.users = users;
                  this.loading = false;
                },
               error: (err) => {
                this.error = 'Failed to load users.';
                  console.error('Error loading users:', err);
                  this.loading = false;
               }
             })
        );
    }
  createUser(): void{
    this.isModalOpen = true;
    this.isEditMode = false;
    this.selectedUser = {
      firstName: '',
      lastName: '',
      email: '',
      role: 'USER',
      age: null,
      salary: null,
        homeOwnership: 'OWN',
      employmentMonth: null
    }
  }
  editUser(user: any): void{
    this.isModalOpen = true;
    this.isEditMode = true;
    this.selectedUser = { ...user };
  }
  deleteUser(id:number){
    this.loading = true;
     this.subscriptions.push(
        this.userService.deleteUser(id).subscribe({
            next: () => {
                this.loadUsers();
                this.loading = false;
             },
            error: (err) => {
                this.error = 'Failed to delete user.';
                 console.error('Error deleting user:', err);
                 this.loading = false;
            }
         })
     );
  }
  closeModal(): void{
      this.isModalOpen = false;
      this.selectedUser = {};
  }
  saveUser(){
    this.loading = true;
      if(this.isEditMode){
        this.subscriptions.push(
             this.userService.updateProfile(this.selectedUser.id, this.selectedUser).subscribe({
                 next: () => {
                   this.loadUsers();
                   this.closeModal();
                 },
                  error: (err) => {
                     this.error = 'Failed to update user.';
                    console.error('Error updating user:', err);
                    this.loading = false;
                   }
                })
        );
      } else {
        this.subscriptions.push(
           this.userService.createUser(this.selectedUser).subscribe({
               next: () => {
                 this.loadUsers();
                 this.closeModal();
                 this.loading = false;
               },
               error: (err) => {
                this.error = 'Failed to create user.';
                  console.error('Error creating user:', err);
                   this.loading = false;
               }
            })
        );
      }
    }
}