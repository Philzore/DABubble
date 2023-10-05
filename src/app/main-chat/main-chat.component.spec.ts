import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainChatComponent } from './main-chat.component';

describe('MainChatComponent', () => {
  let component: MainChatComponent;
  let fixture: ComponentFixture<MainChatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainChatComponent]
    });
    fixture = TestBed.createComponent(MainChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
