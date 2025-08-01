import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnsRefundsComponent } from './returns-refunds.component';

describe('ReturnsRefundsComponent', () => {
  let component: ReturnsRefundsComponent;
  let fixture: ComponentFixture<ReturnsRefundsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnsRefundsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnsRefundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
