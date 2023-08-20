import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomNavigationComponent } from './room-navigation.component';

describe('RoomNavigationComponent', () => {
  let component: RoomNavigationComponent;
  let fixture: ComponentFixture<RoomNavigationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoomNavigationComponent]
    });
    fixture = TestBed.createComponent(RoomNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
