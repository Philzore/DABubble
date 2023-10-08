import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEdituserLogoutComponent } from './dialog-edituser-logout.component';

describe('DialogEdituserLogoutComponent', () => {
  let component: DialogEdituserLogoutComponent;
  let fixture: ComponentFixture<DialogEdituserLogoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogEdituserLogoutComponent]
    });
    fixture = TestBed.createComponent(DialogEdituserLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
