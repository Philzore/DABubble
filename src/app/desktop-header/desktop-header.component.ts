import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogEdituserLogoutComponent } from '../dialog-edituser-logout/dialog-edituser-logout.component';

@Component({
  selector: 'app-desktop-header',
  templateUrl: './desktop-header.component.html',
  styleUrls: ['./desktop-header.component.scss']
})
export class DesktopHeaderComponent {

  constructor(public dialog: MatDialog) {
    
  }
  openDialog() {
    const dialog = this.dialog.open(DialogEdituserLogoutComponent,{position: {top:'100px',right:'50px'}});
  }
}
