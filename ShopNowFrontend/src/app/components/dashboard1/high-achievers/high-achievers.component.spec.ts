import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighAchieversComponent } from './high-achievers.component';

describe('HighAchieversComponent', () => {
  let component: HighAchieversComponent;
  let fixture: ComponentFixture<HighAchieversComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HighAchieversComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HighAchieversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
