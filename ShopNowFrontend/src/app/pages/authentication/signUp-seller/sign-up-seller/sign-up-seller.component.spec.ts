import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpSellerComponent } from './sign-up-seller.component';

describe('SignUpSellerComponent', () => {
  let component: SignUpSellerComponent;
  let fixture: ComponentFixture<SignUpSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpSellerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignUpSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
