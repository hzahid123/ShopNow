import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCategorywiseComponent } from './product-categorywise.component';

describe('ProductCategorywiseComponent', () => {
  let component: ProductCategorywiseComponent;
  let fixture: ComponentFixture<ProductCategorywiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCategorywiseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCategorywiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
