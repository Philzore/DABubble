
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogUserProfilComponent } from '../dialog-user-profil/dialog-user-profil.component';
import { getAuth, signOut } from "firebase/auth";
import { Router } from '@angular/router';
import { UserDataService } from '../services/user-data.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-dialog-edituser-logout',
  templateUrl: './dialog-edituser-logout.component.html',
  styleUrls: ['./dialog-edituser-logout.component.scss']
})
export class DialogEdituserLogoutComponent implements OnInit {
  hideProfil:boolean ;

  constructor(
    public dialogRef: MatDialogRef<DialogEdituserLogoutComponent>,
    public dialog: MatDialog,
    private router: Router,
    private userDataService: UserDataService,
    private sharedService: SharedService) { }


  ngOnInit(): void {
    if (this.userDataService.currentUser['name'] == 'Gast') {
      this.hideProfil = true ;
    } else {
      this.hideProfil = false ;
    }
  }

  showProfil() {
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
    const dialog = this.dialog.open(DialogUserProfilComponent, dialogConfig);
  }
  

  logOut() {
    const auth = getAuth();
    signOut(auth).then(() => {
      // Sign-out successful.
      this.dialogRef.close();
      this.userDataService.clearCurrentUserLocalStorage();
      this.performUnsubscriptions(); // Ensure all unsubscriptions are handled.
      this.router.navigate(['/']);
      this.sharedService.templateIsReady = false;

    }).catch((error) => {
      // An error happened.
      console.error("Error during sign out:", error);
    });
  }

performUnsubscriptions() {
    // Unsubscribe from Thread if the function exists.
    if (this.sharedService.unsubThread) {
      this.sharedService.unsubThread();
    }

    // Unsubscribe from Channels if the function exists.
    if (this.sharedService.unsubChannels) {
      this.sharedService.unsubChannels();
    }
}

}
