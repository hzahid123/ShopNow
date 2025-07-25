import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastNewsletterStatisticsClientsComponent } from './last-newsletter-statistics-clients.component';

describe('LastNewsletterStatisticsClientsComponent', () => {
  let component: LastNewsletterStatisticsClientsComponent;
  let fixture: ComponentFixture<LastNewsletterStatisticsClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LastNewsletterStatisticsClientsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LastNewsletterStatisticsClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
