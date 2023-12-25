import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogEditProfilComponent } from '../dialog-edit-profil/dialog-edit-profil.component';
import { UserDataService } from '../services/user-data.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-dialog-user-profil',
  templateUrl: './dialog-user-profil.component.html',
  styleUrls: ['./dialog-user-profil.component.scss']
})
export class DialogUserProfilComponent implements OnInit {
  userData = {};

  constructor(public dialogRef: MatDialogRef<DialogUserProfilComponent>,
    public dialog: MatDialog,
    public userDataService: UserDataService,
    private sharedService: SharedService) {

  }

  ngOnInit(): void {

  }

  /**
   * open dialog to edit user name and email
   * 
   */
  openEditProfile() {
    // Close the currently open dialog
    this.dialogRef.close();
  
    // Determine if the screen width is greater than 1200px
    const isScreenWidthGreaterThan1200 = window.innerWidth > 1200;
  
    // Configure the dialog settings based on screen width
    const dialogConfig = {
      position: { top: '100px', right: '50px' },
      panelClass: isScreenWidthGreaterThan1200 ? 'custom-logout-dialog' : ''
    };
  
    // Open the dialog with the configured settings
    const dialog = this.dialog.open(DialogEditProfilComponent, dialogConfig);
  
    // Handle the dialog close event
    dialog.afterClosed().subscribe(() => {
      // Perform actions after the dialog is closed
      this.sharedService.createSubscribeChannelMessages();
    });
  }
  
}
