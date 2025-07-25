import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { PrimeSharedModule } from 'src/app/shared/PrimeShared.module';
import { MessageService } from 'primeng/api';
import * as Enums from 'src/app/services/enum.service';
import { ConfirmDialogService } from 'src/app/services/confirm-dialog.service';


@Component({
  selector: 'app-manage-stores',
  standalone: true,
  imports: [SharedModule, PrimeSharedModule],
  templateUrl: './manage-stores.component.html',
  providers: [MessageService, ConfirmDialogService],
  styleUrl: './manage-stores.component.scss'
})
export class ManageStoresComponent implements OnInit {

  storeHeader: string = '';
  searchText: string = '';
  storeForm: FormGroup;
  dataSource: any[] = [];
  selectedShopId: any;
  storeButton: string = '';
  
  // Dialog states
  visible: boolean = false;
  showDeleteDialog: boolean = false;
  
  // Loading and processing states
  isDeleting: boolean = false;
  
  // Store to delete
  storeToDelete: { id: number; storeName: string; emailAddress: string } | null = null;
  
  // Pagination properties
  pageSize = 5;
  totalRecords = this.dataSource.length;
  pageSizes = [5, 10, 20];
  faPencilAlt: any;

  constructor(
    private shopService: ApiService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmDialogService: ConfirmDialogService,
    // private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {
    this.storeForm = this.fb.group({
      name: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      ownerId: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.loadShops();
  }

  private showSuccessMessage(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message,
      life: 3000
    });
  }

  private showErrorMessage(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 5000
    });
  }

  private showWarningMessage(message: string) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Warning',
      detail: message,
      life: 4000
    });
  }

  loadShops(keyword: string = '') {
    console.log("Fetching shops with keyword:", keyword);

    this.shopService.getShops(keyword).subscribe({
      next: (data) => {
        if (data && Array.isArray(data.result?.items)) {
          this.dataSource = data.result.items;
          this.totalRecords = this.dataSource.length;
          // this.showSuccessMessage('Shops loaded successfully');
        } else {
          console.error("Invalid API response format:", data);
          this.dataSource = [];
          this.showErrorMessage('Failed to load shops - Invalid response format');
        }
      },
      error: (err) => {
        console.error("Error fetching shops:", err);
        this.showErrorMessage('Failed to load shops');
      }
    });
  }

  createShop() {
    if (this.storeForm.valid) {
      const shopData = {
        id: this.selectedShopId,
        name: this.storeForm.value.name,
        description: this.storeForm.value.emailAddress,
        ownerId: this.storeForm.value.ownerId
      };

      if (this.selectedShopId) {
        console.log("Updating shop with ID:", this.selectedShopId, "Data:", shopData);
        this.shopService.updateShop(shopData).subscribe({
          next: (response) => {
            console.log("Shop updated successfully:", response);
            this.loadShops();
            this.storeForm.reset();
            this.selectedShopId = null;
            this.visible = false;
            this.showSuccessMessage('Shop updated successfully');
          },
          error: (err) => {
            console.error('Error updating shop:', err);
            this.showErrorMessage('Failed to update shop');
          }
        });
      } else {
        // Create new shop
        this.shopService.createShop(shopData).subscribe({
          next: (response) => {
            console.log("Shop created successfully:", response);
            this.loadShops();
            this.storeForm.reset();
            this.visible = false;
            this.showSuccessMessage('Shop created successfully');
          },
          error: (err) => {
            console.error('Error creating shop:', err);
            this.showErrorMessage('Failed to create shop');
          }
        });
      }
    } else {
      console.warn("Form is invalid:", this.storeForm.value);
      this.showWarningMessage('Please fill all required fields correctly');
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.storeForm.controls).forEach(key => {
      const control = this.storeForm.get(key);
      control?.markAsTouched();
    });
  }

  // Delete dialog functionality
  confirmDelete(id: number, storeName: string) {
    const selectedStore = this.dataSource.find(store => store.id === id);
    if (selectedStore) {
      this.storeToDelete = {
        id,
        storeName,
        emailAddress: selectedStore.emailAddress
      };
      this.showDeleteDialog = true;
    }
  }

  cancelDelete() {
    this.storeToDelete = null;
    this.showDeleteDialog = false;
  }

  confirmDeleteStore() {
    if (this.storeToDelete) {
      this.isDeleting = true;

      this.shopService.deleteShop(this.storeToDelete.id).subscribe({
        next: () => {
          this.isDeleting = false;
          this.showSuccessMessage(`Store "${this.storeToDelete?.storeName}" deleted successfully`);
          this.loadShops();
          this.cancelDelete();
        },
        error: (err) => {
          this.isDeleting = false;
          console.error('Error deleting store:', err);
          this.showErrorMessage('Failed to delete store. Please try again.');
        }
      });
    }
  }

  // Keep the old method for backward compatibility
  deleteShop(id: number, storeName: string) {
    this.confirmDialogService.confirmDialog(
      "Delete Store",
      `Are you sure you want to delete <strong>"${storeName}"</strong> store?`
    ).then(result => {
      if (result === true) {
        this.shopService.deleteShop(id).subscribe({
          next: () => {
            this.loadShops();
            this.showSuccessMessage('Store deleted successfully');
          },
          error: (err) => {
            console.error('Error deleting shop:', err);
            this.showErrorMessage('Failed to delete store');
          }
        });
      }
    });
  }

  shopTypes = [
    { value: 'retail', viewValue: 'Retail' },
    { value: 'wholesale', viewValue: 'Wholesale' }
  ];

  onPageChange(event: any) {
    console.log('Page changed', event);
  }

  editRecord(id: number) {
    console.log("Editing shop with ID:", id);
    const selectedShop = this.dataSource.find(shop => shop.id === id);
    if (selectedShop) {
      console.log("Shop found:", selectedShop);
      this.storeForm.patchValue({
        name: selectedShop.storeName,
        emailAddress: selectedShop.emailAddress,
        ownerId: selectedShop.ownerId
      });
      this.selectedShopId = id;
      this.storeHeader = "Edit Shop";
      this.storeButton = "Update";
      this.visible = true;
    } else {
      console.error("Shop not found in dataSource.");
    }
  }

  deleteRecord(id: number) {
    this.dataSource = this.dataSource.filter(item => item.id !== id);
  }

  showDialog() {
    this.visible = true;
    this.storeHeader = "Add Shop";
    this.storeButton = "Create";
    this.storeForm.reset();
    this.selectedShopId = null;
  }

  closeDialog() {
    this.visible = false;
    this.storeForm.reset();
    this.selectedShopId = null;
  }
}