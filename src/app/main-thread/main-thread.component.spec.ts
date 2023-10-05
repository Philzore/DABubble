import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainThreadComponent } from './main-thread.component';

describe('MainThreadComponent', () => {
  let component: MainThreadComponent;
  let fixture: ComponentFixture<MainThreadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainThreadComponent]
    });
    fixture = TestBed.createComponent(MainThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
