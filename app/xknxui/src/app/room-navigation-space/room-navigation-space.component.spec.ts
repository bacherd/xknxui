import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomNavigationSpaceComponent } from './room-navigation-space.component';

describe('RoomNavigationSpaceComponent', () => {
  let component: RoomNavigationSpaceComponent;
  let fixture: ComponentFixture<RoomNavigationSpaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoomNavigationSpaceComponent]
    });
    fixture = TestBed.createComponent(RoomNavigationSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
