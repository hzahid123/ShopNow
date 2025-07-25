import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { FormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared/shared.module';
import { PrimeSharedModule } from 'src/app/shared/PrimeShared.module';
import { MessageService, PrimeNGConfig} from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { Category} from '../manage-product-categories/manage-product-categories.model';
import { ProductService } from './manage-products.service';
import { MessagesNotificationService } from 'src/app/services/messagesNotification.services';




@Component({
  selector: 'app-manage-prodcuts',
  standalone: true,

  imports: [SharedModule,PrimeSharedModule,FormsModule],
  providers: [MessageService,MessagesNotificationService],

  templateUrl: './manage-prodcuts.component.html',
  styleUrl: './manage-prodcuts.component.scss'
})
export class ManageProdcutsComponent {
  categories: Category[] = [];
  selectedCategory: any = null;
  selectedSubCategory: any = null;
  weightOptions = [
    '100 gram', '200 gram', '300 gram', '400 gram', '500 gram',
    '600 gram', '700 gram', '800 gram', '900 gram',
    '1 kg', '2 kg', '3 kg', '4 kg', '5 kg',
    '6 kg', '7 kg', '8 kg', '9 kg', '10 kg'
  ];

  defaultWeight = '500 gram';
  
  // Dialog states
  visible: boolean = false;
  showDeleteDialog: boolean = false;
  showLoadingDialog: boolean = false;
  
  // Loading and processing states
  isDeleting: boolean = false;
  loadingMessage: string = '';
  
  // Product to delete
  productToDelete: { id: string; name: string; price?: number } | null = null;
  selectedImageUrl: any;
  isEditMode: boolean;
  editingProductId: any;
  
  get weightControl() {
    return this.clientForm.get('weight');
  }

  onWeightChange(event: any): void {
    this.selectedWeight = event.value;
  }
  
  value1: number = 50;
  previewUrl: any = null;
  clientForm: FormGroup = new FormGroup({});
  dataSource: any[] = [];
  selectedShopId: any;
  files: any[] = [];

  totalSize: number = 0;
  totalSizePercent: number = 0;
  filterVisible: boolean = false;
  showCustomRange: boolean = false;
  calculatedRange: string | null = null;
  
  filterForm: FormGroup = new FormGroup({
    range: new FormControl('last30'),
    start: new FormControl(null),
    end: new FormControl(null)
  });
  
  predefinedRanges = [
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'Last 7 Days', value: 'last7' },
    { label: 'Last 2 Weeks', value: 'last14' },
    { label: 'Last 30 Days', value: 'last30' },
    { label: 'This Month', value: 'thisMonth' },
    { label: 'Last Month', value: 'lastMonth' },
    { label: 'Custom Range', value: 'custom' }
  ];
  onRangeChange(value: string) {
    this.showCustomRange = value === 'custom';
    const today = new Date();
    let start: Date | null = null;
    let end: Date | null = null;
  
    switch (value) {
      case 'today':
        start = end = new Date();
        break;
      case 'yesterday':
        start = end = new Date(today);
        start.setDate(today.getDate() - 1);
        break;
      case 'last7':
        start = new Date(today);
        start.setDate(today.getDate() - 6);
        end = new Date();
        break;
      case 'last14':
        start = new Date(today);
        start.setDate(today.getDate() - 13);
        end = new Date();
        break;
      case 'last30':
        start = new Date(today);
        start.setDate(today.getDate() - 29);
        end = new Date();
        break;
      case 'thisMonth':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date();
        break;
      case 'lastMonth':
        const prevMonth = today.getMonth() - 1;
        start = new Date(today.getFullYear(), prevMonth, 1);
        end = new Date(today.getFullYear(), prevMonth + 1, 0);
        break;
      case 'custom':
        return;
    }
  
    if (start && end) {
      this.filterForm.patchValue({ start, end });
  
      const format = (d: Date) =>
        `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  
      this.calculatedRange = `${format(start)} - ${format(end)}`;
    } else {
      this.calculatedRange = null;
    }
  }
  applyFilter() {
    const { start, end } = this.filterForm.value;
    console.log("Apply filter clicked: ", start, end);
    this.filterVisible = false;
  }
  
  cancelFilter() {
    this.filterVisible = false;
  }
  constructor(

    private config: PrimeNGConfig, 
    private messageService: MessageService,
    private categoriesService: ApiService,
    private fb: FormBuilder,
    private productService : ProductService,
    private notificationService: MessagesNotificationService
  ) {

      this.clientForm = this.fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      stockQuantity: [null, [Validators.required, Validators.min(0)]],
      categoryId: [null, Validators.required],
      subCategoryId: [null, Validators.required],
      subSubCategoryId: [null, Validators.required],
      // Individual dimension controls for easier handling
      length: [null, [Validators.required, Validators.min(0)]],
      width: [null, [Validators.required, Validators.min(0)]],
      height: [null, [Validators.required, Validators.min(0)]]
    });
    this.fetchCategories();
    this.loadProducts();
  }

  private showLoadingSpinner() {
   
    this.showLoadingDialog = true;
  }

  private hideLoadingSpinner() {
    this.showLoadingDialog = false;
  }

  


  loadProducts() {
    this.showLoadingSpinner();
    
    this.productService.getAllProducts().subscribe({
      next: (res: any) => {
        this.hideLoadingSpinner();
        this.dataSource = res.result.items || [];
        this.totalRecords = this.dataSource.length;
        

      },
      error: (err: any) => {
        this.hideLoadingSpinner();
        
        this.notificationService.showErrorMessage('Failed to laod products. Please try again');

      }
    });
  }
  
  fetchCategories() {
    this.categoriesService.getCategoriesWithSubCategories().subscribe(
      (data) => {
    
        this.categories = data;
      },
      (error) => {
        console.error('Error fetching categories:', error);
       this.notificationService.showErrorMessage('Failed to load categories. Please try again');

      }
    );
  }

submitForm() {
  if (this.clientForm.invalid) {
    this.clientForm.markAllAsTouched();
    this.notificationService.showWarningMessage('Please fill in all required Fields');
    return;
  }

  const formValue = this.clientForm.value;
  const dimensions = `${formValue.length},${formValue.width},${formValue.height}`;

  const payload1 = {
    name: formValue.name,
    description: formValue.description,
    price: formValue.price,
    stockQuantity: formValue.stockQuantity,
    categoryId: formValue.categoryId,
    subCategoryId: formValue.subCategoryId,
    subSubCategoryId: formValue.subSubCategoryId,
    storeId: sessionStorage.getItem('user.storeId'),
   
    dimensions: dimensions
  };

  const payload2 = {
    id: this.selectedProductId,
    name: formValue.name,
    description: formValue.description,
    price: formValue.price,
    stockQuantity: formValue.stockQuantity,
    categoryId: formValue.categoryId,
    subCategoryId: formValue.subCategoryId,
    subSubCategoryId: formValue.subSubCategoryId,
    storeId: sessionStorage.getItem('user.storeId'),
   
    dimensions: dimensions
  };

  this.showLoadingSpinner();

  if (this.selectedProductId) {
    // ✏️ EDIT mode
    this.productService.editProduct(payload2).subscribe({
      next: () => {
        this.hideLoadingSpinner();
        this.notificationService.showSuccessMessage(`Product "${formValue.name}" updated successfully`);
        this.clientForm.reset();
        this.visible = false;
        this.selectedProductId = null;
        this.loadProducts();
      },
      error: (err: any) => {
        this.hideLoadingSpinner();
        this.notificationService.showErrorMessage('Failed to update product. Please try again.');
        console.error(err);
      }
    });
  } else {
    // ➕ CREATE mode
    this.productService.createProduct(payload1).subscribe({
      next: () => {
        this.hideLoadingSpinner();
        this.notificationService.showSuccessMessage(`Product "${formValue.name}" created successfully`);
        this.clientForm.reset();
        this.visible = false;
        this.loadProducts();
      },
      error: (err: any) => {
        this.hideLoadingSpinner();
        this.notificationService.showErrorMessage('Failed to create product. Please try again.');
        console.error(err);
      }
    });
  }
}

  
  onCategoryChange(categoryId: string) {
    this.selectedCategory = this.categories.find(cat => cat.id === categoryId);
    this.selectedSubCategory = null;
  }
  
  onSubCategoryChange(subCategoryId: string) {
    this.selectedSubCategory = this.selectedCategory?.subCategories.find((sub: { id: string; }) => sub.id === subCategoryId);
  }

  // Delete dialog methods
  confirmDelete(id: string, name: string) {
    const product = this.dataSource.find(p => p.id === id);
    this.productToDelete = { 
      id, 
      name, 
      price: product?.price 
    };
    this.showDeleteDialog = true;
  }

  cancelDelete() {
    this.productToDelete = null;
    this.showDeleteDialog = false;
  }

  confirmDeleteProduct() {
    if (this.productToDelete) {
      this.isDeleting = true;
      
      this.productService.deleteProduct(this.productToDelete.id).subscribe({
        next: () => {
          this.isDeleting = false;
          this.notificationService.showSuccessMessage(`Product "${this.productToDelete?.name}" deleted successfully`);
          this.loadProducts(); // Refresh the products list
          this.cancelDelete();
        },
        error: (err: any) => {
          this.isDeleting = false;
          console.error('Error deleting product:', err);
          this.notificationService.showErrorMessage('Failed to delete product. Please try again.');
        }
      });
    }
  }

  selectedWeight: string = this.clientForm.get('weight')?.value;
  
  choose(event: any, callback: () => void): void {
    callback();
  }

  onRemoveTemplatingFile(
    event: any,
    file: { size: number },
    removeFileCallback: (event: any, index: number) => void,
    index: number
  ): void {
    removeFileCallback(event, index);
    this.totalSize -= parseInt(this.formatSize(file.size));
    this.totalSizePercent = this.totalSize / 10;
  }

  onClearTemplatingUpload(clear: () => void): void {
    clear();
    this.totalSize = 0;
    this.totalSizePercent = 0;
  }

  onTemplatedUpload(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Success',
      detail: 'File Uploaded',
      life: 3000
    });
  }

  onSelectedFiles(event: { currentFiles: { size: number }[] }): void {
    this.files = event.currentFiles;
    this.files.forEach((file) => {
      this.totalSize += parseInt(this.formatSize(file.size));
    });
    this.totalSizePercent = this.totalSize / 10;
  }

  uploadEvent(callback: () => void): void {
    callback();
  }

  formatSize(bytes: number): string {
    const k = 1024;
    const dm = 3;
    const sizes = this.config.translation?.fileSizeTypes;

    if (!sizes || sizes.length === 0) {
      return '0 B';
    }

    if (bytes === 0) {
      return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i]}`;
  }

  shopTypes = [
    { value: 'retail', viewValue: 'Retail' },
    { value: 'wholesale', viewValue: 'Wholesale' }
  ]; 

  // Pagination properties
  pageSize = 5;
  totalRecords = 0;
  pageSizes = [5, 10, 20];

  onPageChange(event: any) {
    console.log('Page changed', event);
  }

  editRecord(id: string) {
    const selectedShop = this.dataSource.find(shop => shop.id === id);
    if (selectedShop) {
        console.log("Shop found:", selectedShop);
        this.clientForm.patchValue({
            name: selectedShop.name,
            description: selectedShop.description,
            ownerId: selectedShop.ownerId,
            category: selectedShop.categoryId,
            subCategory: selectedShop.subCategoryId,
        });
        this.selectedShopId = id;
        this.visible = true;
    } else {
        console.error("Shop not found in dataSource.");
    }
  }

selectedProductId: string | null = null; // add this to the class


editProduct(product: any) {
  console.log('Editing product:', product);
  console.log('Available categories:', this.categories);
  
  
  this.selectedCategory = this.categories.find(cat => cat.name === product.category);
  console.log('Selected category:', this.selectedCategory);
  
 
  if (this.selectedCategory && this.selectedCategory.subCategories) {
    this.selectedSubCategory = this.selectedCategory.subCategories.find(
      (sub: { name: string; }) => sub.name === product.subCategory
    );
    console.log('Selected subcategory:', this.selectedSubCategory);
  }



  this.clientForm.patchValue({
    name: product.name,
    price: product.price,
    stockQuantity: product.stockQuantity,
    categoryId: this.selectedCategory?.id || null,
    subCategoryId: this.selectedSubCategory?.id || null,
    subSubCategoryId: this.selectedSubCategory?.subSubCategories?.find(
      (subSub: { name: string; }) => subSub.name === product.subSubCategory
    )?.id || null,
    length: product.dimensions?.split(',')[0] || null,
    width: product.dimensions?.split(',')[1] || null,
    height: product.dimensions?.split(',')[2] || null
  });

  this.selectedProductId = product.id;
  this.visible = true;
}
// =======
//     categoryId: product.categoryId,
//     subCategoryId: product.subCategoryId,
//     subSubCategoryId: product.subSubCategoryId,
//     length: product.length,
//     width: product.width,
//     height: product.height,
//     description: product.description
//   });

//   // Handle dependent dropdowns (update category & subCategory selections)
//   this.selectedCategory = this.categories.find(c => c.id === product.categoryId);
//   this.selectedSubCategory = this.selectedCategory?.subCategories?.find((sc: { id: any; }) => sc.id === product.subCategoryId);

//   // Optional: If you're handling image separately for edit
//   this.selectedImageUrl = product.imageUrl;
  
//   // Optional flag: so you know this is edit (can use to change button label etc.)
//   this.isEditMode = true;
//   this.editingProductId = product.id;
// } 


  deleteRecord(id: string) {
    this.dataSource = this.dataSource.filter(item => item.id !== id);
  }

  onImageUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.previewUrl = reader.result;
      reader.readAsDataURL(file);
    }
  }

  showDialog() {
  this.clientForm.reset();
  this.selectedProductId = null;
  this.visible = true;
}

}