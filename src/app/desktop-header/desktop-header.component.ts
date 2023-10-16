import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogEdituserLogoutComponent } from '../dialog-edituser-logout/dialog-edituser-logout.component';
import { getAuth } from '@angular/fire/auth';
import { UserDataService } from '../user-data.service';

@Component({
  selector: 'app-desktop-header',
  templateUrl: './desktop-header.component.html',
  styleUrls: ['./desktop-header.component.scss']
})
export class DesktopHeaderComponent {
  currentUserName: string = '';
  userData = [];

  constructor(public dialog: MatDialog, public userDataService:UserDataService) {
    //  this.getCurrentUser();
    // setTimeout(() => {
    //   this.userData = userDataService.getCurrentUser();
    // }, 200); 
  }

  // getCurrentUser() {
  //   const auth = getAuth();
  //   const user = auth.currentUser;

  //   if (user) {
  //     this.currentUserName = user.displayName;
  //   } else {
  //     // No user is signed in.
  //   }
  // }
  openDialog() {
    const dialog = this.dialog.open(DialogEdituserLogoutComponent, { position: { top: '100px', right: '50px' }, panelClass: 'custom-logout-dialog' });
  }
}
