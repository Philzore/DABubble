import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-edit-profil',
  templateUrl: './dialog-edit-profil.component.html',
  styleUrls: ['./dialog-edit-profil.component.scss']
})
export class DialogEditProfilComponent {

  constructor(public dialogRef:MatDialogRef<DialogEditProfilComponent>) {}
}
