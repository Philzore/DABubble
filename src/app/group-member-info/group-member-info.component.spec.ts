import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMemberInfoComponent } from './group-member-info.component';

describe('GroupMemberInfoComponent', () => {
  let component: GroupMemberInfoComponent;
  let fixture: ComponentFixture<GroupMemberInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupMemberInfoComponent]
    });
    fixture = TestBed.createComponent(GroupMemberInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
