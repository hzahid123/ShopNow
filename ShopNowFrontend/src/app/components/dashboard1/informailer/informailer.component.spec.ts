import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformailerComponent } from './informailer.component';

describe('InformailerComponent', () => {
  let component: InformailerComponent;
  let fixture: ComponentFixture<InformailerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformailerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformailerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
