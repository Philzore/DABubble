import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogEditProfilComponent } from '../dialog-edit-profil/dialog-edit-profil.component';

@Component({
  selector: 'app-dialog-user-profil',
  templateUrl: './dialog-user-profil.component.html',
  styleUrls: ['./dialog-user-profil.component.scss']
})
export class DialogUserProfilComponent {


  constructor(public dialogRef:MatDialogRef<DialogUserProfilComponent>, public dialog:MatDialog) {}

  openEditProfile() {
    this.dialogRef.close();
    const dialog = this.dialog.open(DialogEditProfilComponent,{position: {top:'100px',right:'50px'}, panelClass: 'custom-logout-dialog'});
  }
}
