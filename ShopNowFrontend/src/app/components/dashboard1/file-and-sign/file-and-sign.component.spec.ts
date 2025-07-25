import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileAndSignComponent } from './file-and-sign.component';

describe('FileAndSignComponent', () => {
  let component: FileAndSignComponent;
  let fixture: ComponentFixture<FileAndSignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileAndSignComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileAndSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
