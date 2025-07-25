import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Category, SubCategory, SubSubCategory } from '../manage-product-categories/manage-product-categories.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { PrimeSharedModule } from 'src/app/shared/PrimeShared.module';

import { ProgressBarModule } from 'primeng/progressbar';

import { MessageService, ConfirmationService } from 'primeng/api';
import { FormsModule,ReactiveFormsModule} from'@angular/forms';



import { MessagesNotificationService } from 'src/app/services/messagesNotification.services';
@Component({
  
  selector: 'app-manage-product-categories',
  standalone: true,
  imports: [

    ProgressBarModule,
   
    PrimeSharedModule,
    SharedModule,
  ],
  providers: [MessageService, ConfirmationService, MessagesNotificationService],
  templateUrl: './manage-product-categories.component.html',
  styleUrls: ['./manage-product-categories.component.scss']
})
export class ManageProductCategoriesComponent implements OnInit, OnDestroy {
  searchKeyword: string = '';
  categories: Category[] = [];
  private searchTimeout: any;

  displayDialog1: boolean = false;
  displayDialog2: boolean = false;
  displayDialog3: boolean = false;

  // Delete dialog states (re-added as they're used in template)
  showDeleteCategoryDialog: boolean = false;
  showDeleteSubCategoryDialog: boolean = false;
  showDeleteSubSubCategoryDialog: boolean = false;

  // Items to delete (re-added as they're used in template)
  categoryToDelete: { id: string; name: string } | null = null;
  subCategoryToDelete: { id: string; name: string } | null = null;
  subSubCategoryToDelete: { id: string; name: string } | null = null;

  // Loading states (re-added as used in template)
  isDeleting: boolean = false;

  // Selected items for editing
  selectedCategory1: Category = { id: '', name: '' };
  selectedSubCategory: SubCategory = { id: '', name: '', categoryId: '' };
  selectedSubSubCategory: SubSubCategory = { id: '', name: '', subCategoryId: '' };

  // Edit mode flags
  isEditMode1: boolean = false;
  isEditMode2: boolean = false;
  isEditMode3: boolean = false;
  isFirstLoad: boolean = true;

  constructor(
    private categoriesService: ApiService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
     private notificationService: MessagesNotificationService
  ) {}

  ngOnInit() {
    this.fetchCategories();
  }

  ngOnDestroy() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }


  isLoadingBar: boolean = false;

fetchCategories(keyword?: string) {
  this.isLoadingBar = true;

  this.categoriesService.getCategoriesWithSubCategories(keyword).subscribe({
    next: (data) => {
      this.categories = data;
    },
    error: () => {
      this.notificationService.showErrorMessage('Failed to fetch categories');
    },
    complete: () => {
      this.isLoadingBar = false;
      this.isFirstLoad = false;
    }
  });
}


  onSearchInput(event: any) {
    const keyword = event.target.value;
    this.searchKeyword = keyword;

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      this.performSearch();
    }, 300);
  }

  performSearch() {
    this.fetchCategories(this.searchKeyword && this.searchKeyword.trim() ? this.searchKeyword.trim() : '');
  }

  openDialog1(category?: Category) {
    this.isEditMode1 = !!category;
    this.selectedCategory1 = category ? { ...category } : { id: '', name: '' };
    this.displayDialog1 = true;
  }

  saveCategory1() {
    if (!this.selectedCategory1.name.trim()) {
      this.notificationService.showWarningMessage('Category name is required');
      return;
    }

    const request = this.isEditMode1
      ? this.categoriesService.updateCategory(this.selectedCategory1)
      : this.categoriesService.createCategory(this.selectedCategory1);

    request.subscribe({
      next: () => {
        this.fetchCategories(this.searchKeyword || undefined);
        this.notificationService.showSuccessMessage(`Category ${this.isEditMode1 ? 'updated' : 'created'} successfully`);
        this.displayDialog1 = false;
      },
      error: (err) => {
        this.notificationService.showErrorMessage(
          `Could not ${this.isEditMode1 ? 'update' : 'create'} category`);
        
      }
    });
  }

  openDialog2(category: Category, subCategory?: SubCategory) {
    this.isEditMode2 = !!subCategory;
    this.selectedSubCategory = subCategory
      ? { ...subCategory }
      : { id: '', name: '', categoryId: category.id };
    this.displayDialog2 = true;
  }

  saveCategory2() {
    if (!this.selectedSubCategory.name.trim()) {
      this.notificationService.showWarningMessage('Sub-category name is required');
      return;
    }

    const request = this.isEditMode2
      ? this.categoriesService.updateSubCategory(this.selectedSubCategory)
      : this.categoriesService.createSubCategory(this.selectedSubCategory);

    request.subscribe({
      next: () => {
        this.fetchCategories(this.searchKeyword || undefined);
       this.notificationService.showSuccessMessage(
  `Sub-category ${this.isEditMode2 ? 'updated' : 'created'} successfully`
);

        this.displayDialog2 = false;
      },
      error: (err) => {
       this.notificationService.showErrorMessage(
  `Could not ${this.isEditMode2 ? 'update' : 'create'} sub-category`
);

        console.error(err);
      }
    });
  }

  openDialog3(subCategory: SubCategory, subSubCategory?: SubSubCategory) {
    this.isEditMode3 = !!subSubCategory;
    this.selectedSubSubCategory = subSubCategory
      ? { ...subSubCategory }
      : { id: '', name: '', subCategoryId: subCategory.id };
    this.displayDialog3 = true;
  }

  saveCategory3() {
    if (!this.selectedSubSubCategory.name.trim()) {
      this.notificationService.showWarningMessage('Sub-sub-category name is required');
      return;
    }

    const request = this.isEditMode3
      ? this.categoriesService.updateSubSubCategory(this.selectedSubSubCategory)
      : this.categoriesService.createSubSubCategory(this.selectedSubSubCategory);

    request.subscribe({
      next: () => {
        this.fetchCategories(this.searchKeyword || undefined);
        this.notificationService.showSuccessMessage(
  `Sub-sub-category ${this.isEditMode3 ? 'updated' : 'created'} successfully`
);

        this.displayDialog3 = false;
      },
      error: (err) => {
        this.notificationService.showErrorMessage(
  `Could not ${this.isEditMode3 ? 'update' : 'create'} sub-sub-category`
);

        console.error(err);
      }
    });
  }

  // Simplified CRUD operations
  addCategory() {
    this.openDialog1();
  }

  addSubCategory(category: Category) {
    this.openDialog2(category);
  }

  addSubSubCategory(subCategory: SubCategory) {
    this.openDialog3(subCategory);
  }

  // ** Edit Functions **
  editCategory(category: Category) {
    this.openDialog1(category);
  }

  editSubCategory(subCategory: SubCategory, category: Category) {
    this.openDialog2(category, subCategory);
  }

  editSubSubCategory(subSubCategory: SubSubCategory, subCategory: SubCategory) {
    this.openDialog3(subCategory, subSubCategory);
  }

  // Methods to show delete dialogs
  showDeleteCategoryConfirmation(category: Category) {
    this.categoryToDelete = { id: category.id, name: category.name };
    this.showDeleteCategoryDialog = true;
  }

  showDeleteSubCategoryConfirmation(subCategory: SubCategory) {
    this.subCategoryToDelete = { id: subCategory.id, name: subCategory.name };
    this.showDeleteSubCategoryDialog = true;
  }

  showDeleteSubSubCategoryConfirmation(subSubCategory: SubSubCategory) {
    this.subSubCategoryToDelete = { id: subSubCategory.id, name: subSubCategory.name };
    this.showDeleteSubSubCategoryDialog = true;
  }

  // Delete dialog methods for template
  cancelDeleteCategory() {
    this.showDeleteCategoryDialog = false;
    this.categoryToDelete = null;
  }

  confirmDeleteCategoryAction() {
    if (this.categoryToDelete) {
      this.isDeleting = true;
      this.categoriesService.deleteCategory(this.categoryToDelete.id).subscribe({
        next: () => {
          this.fetchCategories(this.searchKeyword || undefined);
          this.notificationService.showSuccessMessage('Category deleted successfully');

          this.showDeleteCategoryDialog = false;
          this.categoryToDelete = null;
          this.isDeleting = false;
        },
        error: (err) => {
          this.notificationService.showErrorMessage('Error while deleting category');

          console.error(err);
          this.isDeleting = false;
        }
      });
    }
  }

  cancelDeleteSubCategory() {
    this.showDeleteSubCategoryDialog = false;
    this.subCategoryToDelete = null;
  }

  confirmDeleteSubCategoryAction() {
    if (this.subCategoryToDelete) {
      this.isDeleting = true;
      this.categoriesService.deleteSubCategory(this.subCategoryToDelete.id).subscribe({
        next: () => {
          this.fetchCategories(this.searchKeyword || undefined);
          this.notificationService.showSuccessMessage('Sub-category deleted successfully');

          this.showDeleteSubCategoryDialog = false;
          this.subCategoryToDelete = null;
          this.isDeleting = false;
        },
        error: (err) => {
          this.notificationService.showErrorMessage('Error while deleting sub-category');

          console.error(err);
          this.isDeleting = false;
        }
      });
    }
  }

  cancelDeleteSubSubCategory() {
    this.showDeleteSubSubCategoryDialog = false;
    this.subSubCategoryToDelete = null;
  }

  confirmDeleteSubSubCategoryAction() {
    if (this.subSubCategoryToDelete) {
      this.isDeleting = true;
      this.categoriesService.deleteSubSubCategory(this.subSubCategoryToDelete.id).subscribe({
        next: () => {
          this.fetchCategories(this.searchKeyword || undefined);
          this.notificationService.showErrorMessage('Error while deleting sub-category');

          this.showDeleteSubSubCategoryDialog = false;
          this.subSubCategoryToDelete = null;
          this.isDeleting = false;
        },
        error: (err) => {
          this.notificationService.showErrorMessage('Error while deleting sub-sub-category');

          console.error(err);
          this.isDeleting = false;
        }
      });
    }
  }

  // Delete Functions with improved confirmation dialogs
  deleteCategory(category: Category, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Are you sure you want to delete the category "${category.name}"? This will also delete all its sub-categories.`,
      header: 'Confirm Category Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.categoriesService.deleteCategory(category.id).subscribe({
          next: () => {
            this.fetchCategories(this.searchKeyword || undefined);
           this.notificationService.showSuccessMessage('Category deleted successfully');

          },
          error: (err) => {
           this.notificationService.showErrorMessage('Error while deleting category');

            console.error(err);
          }
        });
      },
      reject: () => {
        this.notificationService.showWarningMessage('Category deletion cancelled');

      }
    });
  }

  deleteSubCategory(subCategory: SubCategory, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Are you sure you want to delete the sub-category "${subCategory.name}"? This will also delete all its sub-sub-categories.`,
      header: 'Confirm Sub-Category Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.categoriesService.deleteSubCategory(subCategory.id).subscribe({
          next: () => {
            this.fetchCategories(this.searchKeyword || undefined);
            this.notificationService.showSuccessMessage('Sub-category deleted successfully');

          },
          error: (err) => {
            this.notificationService.showErrorMessage('Error while deleting sub-category');

            console.error(err);
          }
        });
      },
      reject: () => {
        this.notificationService.showWarningMessage('Sub-category deletion cancelled');

      }
    });
  }

  deleteSubSubCategory(subSubCategory: SubSubCategory, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Are you sure you want to delete the sub-sub-category "${subSubCategory.name}"?`,
      header: 'Confirm Sub-Sub-Category Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.categoriesService.deleteSubSubCategory(subSubCategory.id).subscribe({
          next: () => {
            this.fetchCategories(this.searchKeyword || undefined);
            this.notificationService.showSuccessMessage('Sub-sub-category deleted successfully');

          },
          error: (err) => {
           this.notificationService.showErrorMessage('Error while deleting sub-sub-category');

            console.error(err);
          }
        });
      },
      reject: () => {
       this.notificationService.showWarningMessage('Sub-sub-category deletion cancelled');

      }
    });
  }
}