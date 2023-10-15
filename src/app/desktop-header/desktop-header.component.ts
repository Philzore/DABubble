import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogEdituserLogoutComponent } from '../dialog-edituser-logout/dialog-edituser-logout.component';
import { getAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-desktop-header',
  templateUrl: './desktop-header.component.html',
  styleUrls: ['./desktop-header.component.scss']
})
export class DesktopHeaderComponent {
  currentUserName: string = '';

  constructor(public dialog: MatDialog) {
    //  this.getCurrentUser();
  }

  getCurrentUser() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      this.currentUserName = user.displayName;
    } else {
      // No user is signed in.
    }
  }
  openDialog() {
    const dialog = this.dialog.open(DialogEdituserLogoutComponent, { position: { top: '100px', right: '50px' }, panelClass: 'custom-logout-dialog' });
  }
}
