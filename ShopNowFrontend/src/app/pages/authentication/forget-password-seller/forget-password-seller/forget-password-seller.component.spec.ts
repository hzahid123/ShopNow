import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetPasswordSellerComponent } from './forget-password-seller.component';

describe('ForgetPasswordSellerComponent', () => {
  let component: ForgetPasswordSellerComponent;
  let fixture: ComponentFixture<ForgetPasswordSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgetPasswordSellerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgetPasswordSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
