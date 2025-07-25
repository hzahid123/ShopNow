import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProdcutsComponent } from './manage-prodcuts.component';

describe('ManageProdcutsComponent', () => {
  let component: ManageProdcutsComponent;
  let fixture: ComponentFixture<ManageProdcutsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageProdcutsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageProdcutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
