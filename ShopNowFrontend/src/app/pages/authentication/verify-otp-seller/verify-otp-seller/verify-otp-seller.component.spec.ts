import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyOtpSellerComponent } from './verify-otp-seller.component';

describe('VerifyOtpSellerComponent', () => {
  let component: VerifyOtpSellerComponent;
  let fixture: ComponentFixture<VerifyOtpSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyOtpSellerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyOtpSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
