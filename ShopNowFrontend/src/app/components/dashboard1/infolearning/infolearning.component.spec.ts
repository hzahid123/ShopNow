import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfolearningComponent } from './infolearning.component';

describe('InfolearningComponent', () => {
  let component: InfolearningComponent;
  let fixture: ComponentFixture<InfolearningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfolearningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfolearningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
