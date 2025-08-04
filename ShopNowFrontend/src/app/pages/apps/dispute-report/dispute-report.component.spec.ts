import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisputeReportComponent } from './dispute-report.component';

describe('DisputeReportComponent', () => {
  let component: DisputeReportComponent;
  let fixture: ComponentFixture<DisputeReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisputeReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisputeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
