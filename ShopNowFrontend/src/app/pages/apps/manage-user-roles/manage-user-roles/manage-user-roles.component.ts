import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { PrimeSharedModule } from 'src/app/shared/PrimeShared.module';
import { TreeNode, MessageService } from 'primeng/api';
import { MessagesNotificationService } from 'src/app/services/messagesNotification.services';


@Component({
  selector: 'app-manage-user-roles',
  standalone: true,
  imports: [SharedModule, PrimeSharedModule],
  providers: [MessageService,MessagesNotificationService],
  templateUrl: './manage-user-roles.component.html',
  styleUrl: './manage-user-roles.component.scss',
})
export class ManageUserRolesComponent implements OnInit {
  searchText: string = ''
  usersHeader: string = '';
  editingUserId: number | null = null;
  permissionTree: TreeNode[] = [];
  selectedPermissions: TreeNode[] = [];
  currentRolePermissions: string[] = [];
  
  // Track if this is the first load
  private isFirstLoad: boolean = true;
  
  // Dialog states
  visible: boolean = false;
  showDeleteDialog: boolean = false;
  showUnsavedDialog: boolean = false;
  showLoadingDialog: boolean = false;
  
  // Loading and processing states
  isDeleting: boolean = false;
  loadingMessage: string = '';
  
  // Role to delete
  roleToDelete: { id: number; name: string } | null = null;
  
  // Form dirty tracking
  private initialFormValues: any = {};
  
  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      ['clean']
    ]
  };

  userRolesForm: FormGroup;
  dataSource: any[] = [];
  dataSourcePermission: any[] = [];
  CreateOrUpdateButton: string = '';
  
  constructor(
    private usersService: ApiService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private messageNotifictionService : MessagesNotificationService
  ) {
    this.userRolesForm = this.fb.group({
      name: ['', Validators.required],
      displayName: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadRoles();
    this.loadPermissions();
    this.setupFormChangeDetection();
  }

  private setupFormChangeDetection() {
    this.userRolesForm.valueChanges.subscribe(() => {
      // Track form changes for unsaved dialog
    });
  }

  private showLoadingSpinner(message: string) {
    this.loadingMessage = message;
    this.showLoadingDialog = true;
  }

  private hideLoadingSpinner() {
    this.showLoadingDialog = false;
  }




  loadRoles(keyword: string = '') {
    console.log("Fetching roles with keyword:", keyword);
    
    // Show loading spinner for first load and manual searches
    if (this.isFirstLoad || keyword.length > 0) {
      this.showLoadingSpinner('Loading roles...');
    }
    
    this.usersService.getUsersRoles(keyword).subscribe({
      next: (data) => {
        if (this.isFirstLoad || keyword.length > 0) {
          this.hideLoadingSpinner();
          
          // Only show success message for first load or manual search
          // this.messageService.add({
          //   severity: 'success',
          //   summary: 'Success',
          //   detail: 'Roles data loaded successfully',
          //   life: 3000
          // });
        }

        if (data && Array.isArray(data.result?.items)) {
          this.dataSource = data.result.items;
          this.totalRecords = this.dataSource.length;
          
          // Mark first load as complete
          if (this.isFirstLoad) {
            this.isFirstLoad = false;
          }
        } else {
          console.error("Invalid API response format:", data);
          this.dataSource = [];
          this.messageNotifictionService.showErrorMessage('Failed to load roles - Invalid response format');
        }
      },
      error: (err) => {
        if (this.isFirstLoad || keyword.length > 0) {
          this.hideLoadingSpinner();
        }
        console.error("Error fetching roles:", err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load roles data',
          life: 5000
        });
      }
    });
  }

  loadPermissions() {
    this.usersService.getUsersPermissions().subscribe({
      next: (data) => {
        if (data && Array.isArray(data.result?.items)) {
          this.dataSourcePermission = data.result.items;
          this.buildPermissionTree();
        } else {
          console.error("Invalid API response format:", data);
          this.dataSourcePermission = [];
          this.messageNotifictionService.showErrorMessage('Failed to load permissions - Invalid response format');
        }
      },
      error: (err) => {
        console.error("Error fetching permissions:", err);
        this.messageNotifictionService.showErrorMessage('Failed to load permissions. Please try again.');
      }
    });
  }

  buildPermissionTree() {
    const treeMap: { [key: string]: TreeNode } = {};

    this.dataSourcePermission.forEach(permission => {
      const parts = permission.name.split('.');
      let currentPath = '';

      parts.forEach((part: string, index: number) => {
        const isLeaf = index === parts.length - 1;
        currentPath = currentPath ? `${currentPath}.${part}` : part;

        if (!treeMap[currentPath]) {
          treeMap[currentPath] = {
            key: currentPath,
            label: part,
            icon: isLeaf ? 'pi pi-file' : 'pi pi-folder',
            leaf: isLeaf,
            children: isLeaf ? undefined : [],
            data: isLeaf ? permission : null
          };
        }
      });
    });

    // Build hierarchy
    Object.keys(treeMap).forEach(key => {
      const node = treeMap[key];
      const lastDotIndex = key.lastIndexOf('.');

      if (lastDotIndex > 0) {
        const parentKey = key.substring(0, lastDotIndex);
        if (treeMap[parentKey] && treeMap[parentKey].children) {
          treeMap[parentKey].children!.push(node);
        }
      }
    });

    // Extract root nodes
    this.permissionTree = Object.values(treeMap).filter(node => {
      if (!node.key) return false;
      const hasParent = node.key.includes('.') &&
                        treeMap[node.key.substring(0, node.key.lastIndexOf('.'))];
      return !node.key.includes('.') || !hasParent;
    });
  }

  createRole() {
    if (this.userRolesForm.valid) {
      const formValue = this.userRolesForm.value;
      const permissions = this.getSelectedPermissionNames();
      const plainDescription = this.getPlainTextValue();
      
      const roleData = {
        name: formValue.name,
        displayName: formValue.displayName,
        description: plainDescription,
        grantedPermissions: permissions
      };

      this.showLoadingSpinner('Creating role...');
      
      this.usersService.createRole(roleData).subscribe({
        next: (response) => {
          this.hideLoadingSpinner();
          console.log("Role created successfully:", response);
          this.messageNotifictionService.showSuccessMessage(`Role "${formValue.displayName}" created successfully`);
          this.loadRoles(); // This will now silently refresh data
          this.resetForm();
          this.visible = false;
        },
        error: (err) => {
          this.hideLoadingSpinner();
          console.error('Error creating role:', err);
          this.messageNotifictionService.showErrorMessage('Failed to create role. Please try again.');
        }
      });
    } else {
      this.messageNotifictionService.showWarningMessage('Please fill in all required fields');
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.userRolesForm.controls).forEach(key => {
      const control = this.userRolesForm.get(key);
      control?.markAsTouched();
    });
  }

  getPlainTextValue() {
    const htmlContent = this.userRolesForm.get('description')?.value;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    return tempDiv.textContent || tempDiv.innerText || '';
  }

  updateRole() {
    if (this.userRolesForm.valid && this.editingUserId) {
      const formValue = this.userRolesForm.value;
      const permissions = this.getSelectedPermissionNames();
      const plainDescription = this.getPlainTextValue();

      const roleData = {
        id: this.editingUserId,
        name: formValue.name,
        displayName: formValue.displayName,
        description: plainDescription, 
        grantedPermissions: permissions
      };

      this.showLoadingSpinner('Updating role...');

      this.usersService.updateRole(roleData).subscribe({
        next: (response) => {
          this.hideLoadingSpinner();
          console.log("Role updated successfully:", response);
          this.messageNotifictionService.showSuccessMessage(`Role "${formValue.displayName}" updated successfully`);
          this.loadRoles(); // This will now silently refresh data
          this.resetForm();
          this.visible = false;
        },
        error: (err) => {
          this.hideLoadingSpinner();
          console.error('Error updating role:', err);
          this.messageNotifictionService.showErrorMessage('Failed to update role. Please try again.');
        }
      });
    } else {
      this.messageNotifictionService.showWarningMessage('Please fill in all required fields');
      this.markFormGroupTouched();
    }
  }

  confirmDelete(id: number, name: string) {
    this.roleToDelete = { id, name };
    this.showDeleteDialog = true;
  }

  cancelDelete() {
    this.roleToDelete = null;
    this.showDeleteDialog = false;
  }

  confirmDeleteRole() {
    if (this.roleToDelete) {
      this.isDeleting = true;
      
      this.usersService.deleteRole(this.roleToDelete.id).subscribe({
        next: () => {
          this.isDeleting = false;
          this.messageNotifictionService.showSuccessMessage(`Role "${this.roleToDelete?.name}" deleted successfully`);
          this.loadRoles(); // This will now silently refresh data
          this.cancelDelete();
        },
        error: (err) => {
          this.isDeleting = false;
          console.error('Error deleting role:', err);
          this.messageNotifictionService.showErrorMessage('Failed to delete role. Please try again.');
        }
      });
    }
  }

  editRecord(id: number) {
    const selectedRole = this.dataSource.find(role => role.id === id);
    if (selectedRole) {
      this.userRolesForm.patchValue({
        name: selectedRole.name,
        displayName: selectedRole.displayName,
        description: selectedRole.description
      });
      
      // Store initial values for change detection
      this.initialFormValues = this.userRolesForm.value;
      
      this.currentRolePermissions = selectedRole.grantedPermissions || [];
      
      // Wait for the next tick to ensure tree is ready
      setTimeout(() => {
        this.preselectPermissions();
      }, 0);
      
      this.usersHeader = "Edit Role";
      this.CreateOrUpdateButton = "Update";
      this.editingUserId = id;
      this.visible = true;
    }
  }

  preselectPermissions() {
    this.selectedPermissions = [];
    
    if (!this.currentRolePermissions || this.currentRolePermissions.length === 0) {
      return;
    }

    // Create a map of all permission nodes by their key
    const permissionMap = new Map<string, TreeNode>();
    
    const buildMap = (nodes: TreeNode[]) => {
      nodes.forEach(node => {
        if (node.key) {
          permissionMap.set(node.key, node);
        }
        if (node.children) {
          buildMap(node.children);
        }
      });
    };

    buildMap(this.permissionTree);

    // First, select all leaf nodes that match the role's permissions
    const selectedLeafNodes: TreeNode[] = [];
    this.currentRolePermissions.forEach(permissionName => {
      const node = permissionMap.get(permissionName);
      if (node && node.leaf) {
        selectedLeafNodes.push(node);
      }
    });

    // Now find and select all parent nodes
    const allSelectedNodes = new Set<TreeNode>();
    
    // Add all leaf nodes
    selectedLeafNodes.forEach(node => {
      allSelectedNodes.add(node);
    });

    // For each selected leaf node, traverse up and select all parent nodes
    selectedLeafNodes.forEach(leafNode => {
      this.selectParentNodes(leafNode.key!, permissionMap, allSelectedNodes);
    });

    // Convert Set to Array
    this.selectedPermissions = Array.from(allSelectedNodes);

    // Trigger change detection
    this.cdr.detectChanges();
  }

  private selectParentNodes(nodeKey: string, permissionMap: Map<string, TreeNode>, selectedNodes: Set<TreeNode>) {
    const lastDotIndex = nodeKey.lastIndexOf('.');
    
    if (lastDotIndex > 0) {
      const parentKey = nodeKey.substring(0, lastDotIndex);
      const parentNode = permissionMap.get(parentKey);
      
      if (parentNode) {
        selectedNodes.add(parentNode);
        // Recursively select grandparents
        this.selectParentNodes(parentKey, permissionMap, selectedNodes);
      }
    }
  }

  getSelectedPermissionNames(): string[] {
    return this.selectedPermissions
      .filter(node => node.leaf && node.data && node.data.name)
      .map(node => node.data.name);
  }

  onSubmitRoleForm() {
    if (this.editingUserId) {
      this.updateRole();
    } else {
      this.createRole();
    }
  }

  private isFormDirty(): boolean {
    if (!this.initialFormValues) return false;
    
    const currentValues = this.userRolesForm.value;
    const initialPermissions = this.currentRolePermissions;
    const currentPermissions = this.getSelectedPermissionNames();
    
    // Check form values
    const formChanged = JSON.stringify(currentValues) !== JSON.stringify(this.initialFormValues);
    
    // Check permissions
    const permissionsChanged = JSON.stringify(initialPermissions.sort()) !== JSON.stringify(currentPermissions.sort());
    
    return formChanged || permissionsChanged;
  }

  cancelDialog() {
    if (this.isFormDirty()) {
      this.showUnsavedDialog = true;
    } else {
      this.closeDialog();
    }
  }

  stayOnDialog() {
    this.showUnsavedDialog = false;
  }

  discardChanges() {
    this.showUnsavedDialog = false;
    this.closeDialog();
  }

  private resetForm() {
    this.userRolesForm.reset();
    this.editingUserId = null;
    this.currentRolePermissions = [];
    this.selectedPermissions = [];
    this.initialFormValues = {};
  }

  // Pagination
  pageSize = 5;
  totalRecords = 0;
  pageSizes = [5, 10, 20];

  onPageChange(event: any) {
    console.log('Page changed', event);
  //  this.showInfoMessage(`Showing page ${event.page + 1}`);
  }

  showDialog() {
    this.visible = true;
    this.usersHeader = "Add Role";
    this.CreateOrUpdateButton = "Create";
    this.resetForm();
  }

  closeDialog() {
    this.visible = false;
    this.resetForm();
  }
}