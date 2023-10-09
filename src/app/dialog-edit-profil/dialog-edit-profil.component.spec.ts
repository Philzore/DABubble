import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditProfilComponent } from './dialog-edit-profil.component';

describe('DialogEditProfilComponent', () => {
  let component: DialogEditProfilComponent;
  let fixture: ComponentFixture<DialogEditProfilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogEditProfilComponent]
    });
    fixture = TestBed.createComponent(DialogEditProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
