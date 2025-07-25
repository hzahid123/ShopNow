import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastNewsletterStatisticsEmployeesComponent } from './last-newsletter-statistics-employees.component';

describe('LastNewsletterStatisticsEmployeesComponent', () => {
  let component: LastNewsletterStatisticsEmployeesComponent;
  let fixture: ComponentFixture<LastNewsletterStatisticsEmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LastNewsletterStatisticsEmployeesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LastNewsletterStatisticsEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
