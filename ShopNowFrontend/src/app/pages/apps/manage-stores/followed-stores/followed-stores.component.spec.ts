import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowedStoresComponent } from './followed-stores.component';

describe('FollowedStoresComponent', () => {
  let component: FollowedStoresComponent;
  let fixture: ComponentFixture<FollowedStoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowedStoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowedStoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
