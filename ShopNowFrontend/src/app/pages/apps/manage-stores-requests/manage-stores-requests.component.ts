import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedModule } from 'src/app/shared/shared.module';
import { PrimeSharedModule } from 'src/app/shared/PrimeShared.module';
import { ApiService } from 'src/app/services/api.service';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

export interface StoreRequest {
  id: number;
  storeName: string;
  description: string;
  ownerId: string;
  ownerName?: string;
  storerequestStatus: number; // 0 = Pending, 1 = Approved, 2 = Rejected
  createdDate: Date;
  lastModifiedDate?: Date;
  rejectionReason?: string;

}

@Component({
  selector: 'app-manage-stores-requests',
  standalone: true,
  imports: [SharedModule, PrimeSharedModule],
  templateUrl: './manage-stores-requests.component.html',
  providers: [MessageService, ConfirmDialogModule],
  styleUrl: './manage-stores-requests.component.scss'
})
export class ManageStoresRequestsComponent implements OnInit {
  // storeRequests: any[] = [];
  // selectedStoreRequest: any = null;
  // showStoreDetailDialog: boolean = false;

  storeRequestForm: FormGroup;
  storeHeader: string = '';
  storeButton: string = '';

  // Data properties
  dataSource: StoreRequest[] = [];
  filteredDataSource: StoreRequest[] = [];
  selectedShopId: number | null = null;

  // UI state
  visible: boolean = false;
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  isUpdatingStatus: boolean = false;

  // Status change confirmation
  showStatusConfirmDialog: boolean = false;
  pendingStatusChange: number = 0;
  selectedElement: StoreRequest | null = null;
  rejectionReason: string = '';

  // Delete confirmation dialog
  showDeleteConfirmDialog: boolean = false;
  selectedDeleteId: number | null = null;

  // Filters and search
  selectedStatusFilter: string = '';
  searchTerm: string = '';

  // Pagination
  pageSize = 10;
  totalRecords = 0;
  pageSizes = [5, 10, 20, 50];

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.initializeForm();
  }

  ngOnInit() {
    this.loadStoreRequests();
  }


  private initializeForm(): void {
    this.storeRequestForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      ownerId: ['', [Validators.required]]
    });
  }

//  viewDetails(element: any): void {
//     this.selectedStoreRequest = element; // ✅ use the parameter
//     this.showStoreDetailDialog = true;
//   }

  // Data loading and filtering
  loadStoreRequests(): void {
    this.isLoading = true;
    this.apiService.getStoreRequests().subscribe({
      next: (response) => {
        if (response?.result?.items) {
          this.dataSource = response.result.items;
          this.totalRecords = response.result.totalCount || this.dataSource.length;
          this.applyFilters();
        } else {
          this.dataSource = [];
          this.filteredDataSource = [];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading store requests:', error);
        this.showErrorMessage('Failed to load store requests');
        this.isLoading = false;
      }
    });
  }


  applyFilters(): void {
    let filtered = [...this.dataSource];

    // Apply status filter
    if (this.selectedStatusFilter !== '') {
      const statusFilter = parseInt(this.selectedStatusFilter);
      filtered = filtered.filter(item => item.storerequestStatus === statusFilter);
    }

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.storeName.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        (item.ownerName && item.ownerName.toLowerCase().includes(searchLower))
      );
    }

    this.filteredDataSource = filtered;
  }

  applyStatusFilter(): void {
    this.applyFilters();
  }

  // Search functionality
  applySearch(): void {
    let filtered = [...this.dataSource]; // use your full list here

    const search = this.searchTerm?.trim().toLowerCase();
    if (search) {
      filtered = filtered.filter(item =>
        item.storeName?.toLowerCase().includes(search) ||
        item.ownerName?.toLowerCase().includes(search)
      );
    }

    this.filteredDataSource = filtered;
  }

  // Status management
  updateStatus(element: StoreRequest, newStatus: number): void {

    this.selectedElement = element;
    this.pendingStatusChange = newStatus;
    this.rejectionReason = '';
    this.showStatusConfirmDialog = true;
  }

  confirmStatusChange(): void {
    if (!this.selectedElement) return;

    this.isUpdatingStatus = true;

    // Check if it's an approval action
    if (this.pendingStatusChange === 1) {
      // Call the approveStoreRequest API
      this.apiService.approveStoreRequest(this.selectedElement.id.toString()).subscribe({
        next: (response) => {
          console.log('Store request approved:', response);
          this.showSuccessMessage('Store request approved successfully');
          this.loadStoreRequests();
          this.cancelStatusChange();
          this.isUpdatingStatus = false;
        },
        error: (error) => {
          console.error('Error approving store request:', error);
          this.showErrorMessage('Failed to approve store request');
          this.isUpdatingStatus = false;
        }
      });
    } else if (this.pendingStatusChange === 2) {
      // Handle rejection - implement rejectStoreRequest API call
      const updateData = {
        id: this.selectedElement.id,
        status: this.pendingStatusChange,
        rejectionReason: this.rejectionReason
      };

      // TODO: Uncomment when rejectStoreRequest API is available
      // this.apiService.rejectStoreRequest(updateData).subscribe({
      //   next: (response) => {
      //     this.showSuccessMessage('Store request rejected successfully');
      //     this.loadStoreRequests();
      //     this.cancelStatusChange();
      //     this.isUpdatingStatus = false;
      //   },
      //   error: (error) => {
      //     console.error('Error rejecting store request:', error);
      //     this.showErrorMessage('Failed to reject store request');
      //     this.isUpdatingStatus = false;
      //   }
      // });

      // Temporary simulation for rejection - remove when API is ready
      setTimeout(() => {
        const index = this.dataSource.findIndex(item => item.id === this.selectedElement!.id);
        if (index !== -1) {
          this.dataSource[index].storerequestStatus = this.pendingStatusChange;
          this.dataSource[index].lastModifiedDate = new Date();
          if (this.rejectionReason) {
            this.dataSource[index].rejectionReason = this.rejectionReason;
          }
        }
        this.applyFilters();
        this.showSuccessMessage('Request rejected successfully');
        this.cancelStatusChange();
        this.isUpdatingStatus = false;
      }, 1000);
    } else if (this.pendingStatusChange === 0) {
      // Handle reset to pending - implement resetToPending API call
      // TODO: Uncomment when resetStoreRequestToPending API is available
      // this.apiService.resetStoreRequestToPending(this.selectedElement.id).subscribe({
      //   next: (response) => {
      //     this.showSuccessMessage('Store request reset to pending successfully');
      //     this.loadStoreRequests();
      //     this.cancelStatusChange();
      //     this.isUpdatingStatus = false;
      //   },
      //   error: (error) => {
      //     console.error('Error resetting store request:', error);
      //     this.showErrorMessage('Failed to reset store request');
      //     this.isUpdatingStatus = false;
      //   }
      // });

      // Temporary simulation for reset - remove when API is ready
      setTimeout(() => {
        const index = this.dataSource.findIndex(item => item.id === this.selectedElement!.id);
        if (index !== -1) {
          this.dataSource[index].storerequestStatus = 0;
          this.dataSource[index].lastModifiedDate = new Date();
        }
        this.applyFilters();
        this.showSuccessMessage('Request reset to pending successfully');
        this.cancelStatusChange();
        this.isUpdatingStatus = false;
      }, 1000);
    }
  }

 
  cancelStatusChange(): void {
    this.showStatusConfirmDialog = false;
    this.selectedElement = null;
    this.pendingStatusChange = 0;
    this.rejectionReason = '';
  }

  resetToPending(element: StoreRequest): void {
    this.updateStatus(element, 0);
  }

  // CRUD operations
  openCreateDialog(): void {
    this.selectedShopId = null;
    this.storeHeader = 'Create New Store Request';
    this.storeButton = 'Create Request';
    this.storeRequestForm.reset();
    this.visible = true;
  }

  editRecord(id: number): void {

    const selectedShop = this.dataSource.find(shop => shop.id === id);
    if (selectedShop) {
      this.storeRequestForm.patchValue({
        name: selectedShop.storeName,
        description: selectedShop.description,
        ownerId: selectedShop.ownerId
      });
      this.selectedShopId = id;
      this.storeHeader = 'Edit Store Request';
      this.storeButton = 'Update Request';
      this.visible = true;
    } else {
      this.showErrorMessage('Store request not found');
    }
  }

  createShopRequest(): void {
    if (!this.storeRequestForm.valid) {
      this.markFormGroupTouched(this.storeRequestForm);
      return;
    }

    this.isSubmitting = true;
    const formData = this.storeRequestForm.value;

    if (this.selectedShopId) {
      // Update existing request - uncomment when API is ready
      // this.apiService.updateStoreRequest(this.selectedShopId, formData).subscribe({
      //   next: (response) => {
      //     this.showSuccessMessage('Store request updated successfully');
      //     this.loadStoreRequests();
      //     this.closeDialog();
      //     this.isSubmitting = false;
      //   },
      //   error: (error) => {
      //     console.error('Error updating store request:', error);
      //     this.showErrorMessage('Failed to update store request');
      //     this.isSubmitting = false;
      //   }
      // });
    } else {
      // Create new request
      this.apiService.createStoreRequest(formData).subscribe({
        next: (response) => {
          this.showSuccessMessage('Store request created successfully');
          this.loadStoreRequests();
          this.closeDialog();
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error creating store request:', error);
          this.showErrorMessage('Failed to create store request');
          this.isSubmitting = false;
        }
      });
    }
  }

  // Delete operations with PrimeNG Dialog
  deleteShop(id: number): void {
    this.selectedDeleteId = id;
    this.showDeleteConfirmDialog = true;
  }

  confirmDelete(): void {
    if (this.selectedDeleteId === null) return;

    // Uncomment when API is ready
    // this.apiService.deleteStoreRequest(this.selectedDeleteId).subscribe({
    //   next: () => {
    //     this.dataSource = this.dataSource.filter(item => item.id !== this.selectedDeleteId);
    //     this.applyFilters();
    //     this.showSuccessMessage('Store request deleted successfully');
    //     this.cancelDelete();
    //   },
    //   error: (error) => {
    //     console.error('Error deleting store request:', error);
    //     this.showErrorMessage('Failed to delete store request');
    //   }
    // });

    // Temporary simulation - remove when API is ready
    this.dataSource = this.dataSource.filter(item => item.id !== this.selectedDeleteId);
    this.applyFilters();
    this.showSuccessMessage('Store request deleted successfully');
    this.cancelDelete();
  }

  cancelDelete(): void {
    this.showDeleteConfirmDialog = false;
    this.selectedDeleteId = null;
  }


  // Dialog management
  closeDialog(): void {
    this.visible = false;
    this.storeRequestForm.reset();
    this.selectedShopId = null;
  }

  // Pagination
  onPageChange(event: any): void {
    console.log('Page changed:', event);
    // Implement server-side pagination if needed
  }

  // Utility methods
  getStatusLabel(status: number): string {
    switch (status) {
      case 0: return 'Pending';
      case 1: return 'Approved';
      case 2: return 'Rejected';
      default: return 'Unknown';
    }
  }

  getStatusActionText(status: number): string {
    switch (status) {
      case 0: return 'reset';
      case 1: return 'approve';
      case 2: return 'reject';
      default: return 'update';
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}