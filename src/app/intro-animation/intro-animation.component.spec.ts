import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroAnimationComponent } from './intro-animation.component';

describe('IntroAnimationComponent', () => {
  let component: IntroAnimationComponent;
  let fixture: ComponentFixture<IntroAnimationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IntroAnimationComponent]
    });
    fixture = TestBed.createComponent(IntroAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
