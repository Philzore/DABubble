import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUserProfilComponent } from './dialog-user-profil.component';

describe('DialogUserProfilComponent', () => {
  let component: DialogUserProfilComponent;
  let fixture: ComponentFixture<DialogUserProfilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogUserProfilComponent]
    });
    fixture = TestBed.createComponent(DialogUserProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
