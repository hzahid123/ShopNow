import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageStoresRequestsComponent } from './manage-stores-requests.component';

describe('ManageStoresRequestsComponent', () => {
  let component: ManageStoresRequestsComponent;
  let fixture: ComponentFixture<ManageStoresRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageStoresRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageStoresRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
