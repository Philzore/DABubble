import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogEditProfilComponent } from '../dialog-edit-profil/dialog-edit-profil.component';
import { UserDataService } from '../user-data.service';

@Component({
  selector: 'app-dialog-user-profil',
  templateUrl: './dialog-user-profil.component.html',
  styleUrls: ['./dialog-user-profil.component.scss']
})
export class DialogUserProfilComponent implements OnInit{
  userData = {} ;

  constructor(public dialogRef:MatDialogRef<DialogUserProfilComponent>, public dialog:MatDialog, public userDataService:UserDataService) {
    
  }

  ngOnInit(): void {
    
  }

  /**
   * open dialog to edit user name and email
   * 
   */
  openEditProfile() {
    this.dialogRef.close();
    const dialog = this.dialog.open(DialogEditProfilComponent,{position: {top:'100px',right:'50px'}, panelClass: 'custom-logout-dialog'});
  }
}
