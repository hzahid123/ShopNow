import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { PrimeSharedModule } from 'src/app/shared/PrimeShared.module';
@Component({
  selector: 'app-manage-payments',
  standalone: true,
  imports: [SharedModule,PrimeSharedModule],
  templateUrl: './manage-payments.component.html',
  styleUrl: './manage-payments.component.scss'
})
export class ManagePaymentsComponent {
  clientForm: FormGroup = new FormGroup({});
  dataSource: any[] = [];
  selectedShopId: any;
  constructor(
    // private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {
    this.clientForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      ownerId: new FormControl('', Validators.required)
    });
  }
  ngOnInit() {
    console.log("ngOnInit is called, loading shops in 2 sec...");

    // setTimeout(() => , 2000);
    // this.loadShops();
  }

  // loadShops() {
  //   console.log("Fetching shops...");

  //   this.shopService.getShops().subscribe({
  //     next: (data) => {
  //       console.log("Shops data received:", data);

  //       if (data && Array.isArray(data.result?.items)) {
  //         this.dataSource = data.result.items;
  //         // this.cdr.detectChanges(); // Manually trigger change detection
  //       } else {
  //         console.error("Invalid API response format:", data);
  //         this.dataSource = [];
  //       }
  //     },
  //     error: (err) => console.error("Error fetching shops:", err)
  //   });
  // }
  
  
  

  // createShop() {
  //   if (this.clientForm.valid) {
  //     const shopData = {
  //       id: this.selectedShopId,
  //       name: this.clientForm.value.name,
  //       description: this.clientForm.value.description,
  //       ownerId: this.clientForm.value.ownerId
  //     };
  
  //     if (this.selectedShopId) {
  //       console.log("Updating shop with ID:", this.selectedShopId, "Data:", shopData);
  //       this.shopService.updateShop( shopData).subscribe({
  //           next: (response) => {
  //               console.log("Shop updated successfully:", response);
  //               this.loadShops();
  //               this.clientForm.reset();
  //               this.selectedShopId = null;
  //               this.visible = false; 
  //           },
  //           error: (err) => console.error('Error updating shop:', err)
  //       });
  //   }
  //    else {
      
  //       this.shopService.createShop(shopData).subscribe({
  //         next: (response) => {
  //           console.log("Shop created successfully:", response);
  //           this.loadShops();
  //           this.clientForm.reset();
  //           this.visible = false;
  //         },
  //         error: (err) => console.error('Error creating shop:', err)
  //       });
  //     }
  //   } else {
  //     console.warn("Form is invalid:", this.clientForm.value);
  //   }
  // }
  
  

  // deleteShop(id: number) {
  //   this.shopService.deleteShop(id).subscribe({
  //     next: () => this.loadShops(),
  //     error: (err) => console.error('Error deleting shop:', err)
  //   });
  // }
  

  
  shopTypes = [
    { value: 'retail', viewValue: 'Retail' },
    { value: 'wholesale', viewValue: 'Wholesale' }
  ]; 



  visible: boolean = false;
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

  // Pagination properties
  pageSize = 5;
  totalRecords = this.dataSource.length;
  pageSizes = [5, 10, 20];
faPencilAlt: any;

  onPageChange(event: any) {
    console.log('Page changed', event);
  }

  
 
  
  editRecord(id: number) {
    console.log("Editing shop with ID:", id);
    const selectedShop = this.dataSource.find(shop => shop.id === id);
    if (selectedShop) {
        console.log("Shop found:", selectedShop);
        this.clientForm.patchValue({
            name: selectedShop.name,
            description: selectedShop.description,
            ownerId: selectedShop.ownerId
        });
        this.selectedShopId = id; // Store the ID of the shop being edited
        this.visible = true; // Open the dialog
    } else {
        console.error("Shop not found in dataSource.");
    }
}


  deleteRecord(id: number) {
    this.dataSource = this.dataSource.filter(item => item.id !== id);
  }



  showDialog() {
      this.visible = true;
  }
}
