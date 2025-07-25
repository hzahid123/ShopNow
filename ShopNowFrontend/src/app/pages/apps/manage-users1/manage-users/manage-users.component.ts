import { Component, OnInit} from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { PrimeSharedModule } from 'src/app/shared/PrimeShared.module';
import { MessagesNotificationService } from 'src/app/services/messagesNotification.services';
import { MessageService } from 'primeng/api'; // Add this import

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [SharedModule, PrimeSharedModule],
  providers: [MessageService , MessagesNotificationService], // Add MessageService as a provider
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss',
})
export class ManageUsersComponent implements OnInit {
  searchText: string = '';
  usersHeader: string = '';
  editingUserId: number | null = null;

  // Dialog states
  visible: boolean = false;
  showDeleteDialog: boolean = false;
  
  // Loading and processing states
  isDeleting: boolean = false;
  isLoadingUsers: boolean = false; // Add loading state for users
  
  // User to delete
  userToDelete: { id: number; userName: string; fullName: string } | null = null;

  usersForm: FormGroup;
  dataSource: any[] = [];
  roles: any[] = [];
  allRoles: any[] = [];
  selectedShopId: any;
  usersButton: string = '';
  
  // Pagination properties
  pageSize = 5;
  totalRecords = 0;
  pageSizes = [5, 10, 20];
  faPencilAlt: any;
  
  constructor(
    private usersService: ApiService,
    private fb: FormBuilder,
    private messageNotificationService: MessagesNotificationService
  ) {
    this.usersForm = this.fb.group({
      userName: ['', Validators.required],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      userType: [0],
      roleNames: [[], Validators.required], // single-value array
      isActive: [true]
    });
  }

  ngOnInit() {
    console.log("ngOnInit is called, loading users in 2 sec...");
    this.loadUsers();
    this.initializeRoles(); // Initialize hardcoded roles
  }

  // Initialize hardcoded roles
  private initializeRoles() {
    this.roles = [
      { id: 0, name: 'admin' },
      { id: 2, name: 'seller' },
      { id: 3, name: 'customer' }
    ];
    this.allRoles = [...this.roles]; // Copy all roles
    console.log("Hardcoded roles initialized:", this.roles);
  }

  loadUsers(keyword?: string) {
    console.log("Fetching Users...");
    this.isLoadingUsers = true; // Start loading

    this.usersService.getUsers(keyword).subscribe({
      next: (data) => {
        console.log("User data received:", data);
        this.isLoadingUsers = false; // Stop loading

        if (data && Array.isArray(data.result?.items)) {
          this.dataSource = data.result.items;
          this.totalRecords = this.dataSource.length;
        } else {
console.error("Invalid API response format:", data);
          this.dataSource = [];
          this.messageNotificationService.showErrorMessage('Failed to load users - Invalid response format');
        }
      },
      error: (err) => {
        console.error("Error fetching users:", err);
        this.isLoadingUsers = false; // Stop loading on error
        this.messageNotificationService.showErrorMessage('Failed to load users');
      }
    });
  }

            onRoleChange(selectedRoleName: string) {
    const selectedRole = this.roles.find(role => role.name === selectedRoleName);
    if (selectedRole) {
      this.usersForm.get('userType')?.setValue(selectedRole.id);
    }
  }
  
  createUser() {
    if (this.usersForm.valid) {
      const formValue = this.usersForm.value;

      const userData = {
        userName: formValue.userName,
        name: formValue.name,
        surname: formValue.surname,
        emailAddress: formValue.emailAddress,
        password: formValue.password,
        userType: formValue.userType,
        roleNames: [formValue.roleNames],
        isActive: formValue.isActive
      };

      this.usersService.createUser(userData).subscribe({
        next: (response) => {
          console.log("User created successfully:", response);
          this.loadUsers();
          this.resetForm();
          this.visible = false;
          this.messageNotificationService.showSuccessMessage(`User "${formValue.userName}" created successfully`);
        },
        error: (err) => {
          console.error('Error creating user:', err);
          this.messageNotificationService.showErrorMessage('Failed to create user. Please try again.');
        }
      });
    } else {
      console.warn("Form is invalid:", this.usersForm.value);
      this.messageNotificationService.showWarningMessage('Please fill all required fields correctly');
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.usersForm.controls).forEach(key => {
      const control = this.usersForm.get(key);
      control?.markAsTouched();
    });
  }

  editUser(id: number) {
    if (this.usersForm.valid) {
      const formValue = this.usersForm.value;

      const userData = {
        id: id, // Ensure the ID is included in the data
        userName: formValue.userName,
        name: formValue.name,
        surname: formValue.surname,
        emailAddress: formValue.emailAddress,
        password: formValue.password,
        userType: formValue.userType,
        roleNames: [formValue.roleNames],
        isActive: formValue.isActive
      };

      console.log("Updating user with ID:", id, "Data:", userData);
      this.usersService.editUser(userData).subscribe({
        next: (response) => {
          console.log("User updated successfully:", response);
          this.loadUsers();
          this.resetForm();
          this.visible = false;
          this.messageNotificationService.showSuccessMessage(`User "${formValue.userName}" updated successfully`);
        },
        error: (err) => {
          console.error('Error updating user:', err);
          this.messageNotificationService.showErrorMessage('Failed to update user. Please try again.');
        }
      });
    } else {
      console.warn("Form is invalid:", this.usersForm.value);
      this.messageNotificationService.showWarningMessage('Please fill all required fields correctly');
      this.markFormGroupTouched();
    }
  }

  // Delete dialog functionality
  confirmDelete(id: number, userName: string, name: string, surname: string) {
    this.userToDelete = { 
      id, 
      userName, 
      fullName: `${name} ${surname}` 
    };
    this.showDeleteDialog = true;
  }

  cancelDelete() {
    this.userToDelete = null;
    this.showDeleteDialog = false;
  }

  confirmDeleteUser() {
    if (this.userToDelete) {
      this.isDeleting = true;
      
      this.usersService.deleteUsers(this.userToDelete.id).subscribe({
        next: () => {
          this.isDeleting = false;
          this.messageNotificationService.showSuccessMessage(`User "${this.userToDelete?.userName}" deleted successfully`);
          this.loadUsers();
          this.cancelDelete();
        },
        error: (err) => {
          this.isDeleting = false;
          console.error('Error deleting user:', err);
          this.messageNotificationService.showErrorMessage('Failed to delete user. Please try again.');
        }
      });
    }
  }

  // Keep the old method for backward compatibility if needed elsewhere
  deleteUser(id: number) {
    this.usersService.deleteUsers(id).subscribe({
      next: () => {
        this.loadUsers();
        this.messageNotificationService.showSuccessMessage('User deleted successfully');
      },
      error: (err) => {
        console.error('Error deleting user:', err);
        this.messageNotificationService.showErrorMessage('Failed to delete user');
      }
    });
  }

  onPageChange(event: any) {
    console.log('Page changed', event);
  }
  
  editRecord(id: number) {
    const selectedUser = this.dataSource.find(user => user.id === id);
    if (selectedUser) {
      // Find the role name based on userType
      const selectedRole = this.roles.find(role => role.id === selectedUser.userType);
      const roleName = selectedRole ? selectedRole.name : '';

      this.usersForm.patchValue({
        userName: selectedUser.userName,
        name: selectedUser.name,
        surname: selectedUser.surname,
        emailAddress: selectedUser.emailAddress,
        password: '', // Leave empty for security
        userType: selectedUser.userType,
        roleNames: roleName, // Set the role name instead of roleNames array
        isActive: selectedUser.isActive
      });
      this.usersHeader = "Edit User";
      this.usersButton = "Update";
      this.editingUserId = id; // <== Set ID here
      this.visible = true;
    }
  }

  onSubmitUserForm() {
    if (this.editingUserId) {
      this.editUser(this.editingUserId);
    } else {
      this.createUser();
    }
  }

  deleteRecord(id: number) {
    this.dataSource = this.dataSource.filter(item => item.id !== id);
  }

  showDialog() {
    this.visible = true;
    this.usersHeader = "Add Users";
    this.usersButton = "Create";
    this.resetForm();
  }

  closeDialog() {
    this.visible = false;
    this.resetForm();
  }

  private resetForm() {
    this.usersForm.reset();
    this.editingUserId = null;
    // Reset form to default values
    this.usersForm.patchValue({
      userType: 0,
      isActive: true
    });
  }
}