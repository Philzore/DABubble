import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMemberComponent } from './group-member.component';

describe('GroupMemberComponent', () => {
  let component: GroupMemberComponent;
  let fixture: ComponentFixture<GroupMemberComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupMemberComponent]
    });
    fixture = TestBed.createComponent(GroupMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
