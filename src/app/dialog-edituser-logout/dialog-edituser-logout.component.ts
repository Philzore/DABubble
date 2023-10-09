import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogUserProfilComponent } from '../dialog-user-profil/dialog-user-profil.component';


@Component({
  selector: 'app-dialog-edituser-logout',
  templateUrl: './dialog-edituser-logout.component.html',
  styleUrls: ['./dialog-edituser-logout.component.scss']
})
export class DialogEdituserLogoutComponent {


 constructor(public dialogRef: MatDialogRef<DialogEdituserLogoutComponent>, public dialog:MatDialog) {}

  showProfil(){
    this.dialogRef.close();
    const dialog = this.dialog.open(DialogUserProfilComponent, {position: {top:'100px',right:'50px'}, panelClass: 'custom-logout-dialog'});
  }
}
