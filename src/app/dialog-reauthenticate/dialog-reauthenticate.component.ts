import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogEditProfilComponent } from '../dialog-edit-profil/dialog-edit-profil.component';
import { UserDataService } from '../services/user-data.service';

@Component({
  selector: 'app-dialog-reauthenticate',
  templateUrl: './dialog-reauthenticate.component.html',
  styleUrls: ['./dialog-reauthenticate.component.scss']
})
export class DialogReauthenticateComponent {
  currentPassword: string = '';

  constructor(public dialogRef: MatDialogRef<DialogReauthenticateComponent>, public userDataService:UserDataService) { }

  reauthenticate() {
    if (this.userDataService.reAuthenticate(this.currentPassword)) {
      this.dialogRef.close({event : 'success'});
    } else {
      this.dialogRef.close({event : 'error'});
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
