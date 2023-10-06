import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupInfoPopupComponent } from './group-info-popup.component';

describe('GroupInfoPopupComponent', () => {
  let component: GroupInfoPopupComponent;
  let fixture: ComponentFixture<GroupInfoPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupInfoPopupComponent]
    });
    fixture = TestBed.createComponent(GroupInfoPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
