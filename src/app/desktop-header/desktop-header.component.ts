import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogEdituserLogoutComponent } from '../dialog-edituser-logout/dialog-edituser-logout.component';
import { UserDataService } from '../services/user-data.service';


@Component({
  selector: 'app-desktop-header',
  templateUrl: './desktop-header.component.html',
  styleUrls: ['./desktop-header.component.scss']
})
export class DesktopHeaderComponent implements OnInit {
  currentUserName: string = '';
  userData:object = {
    name : '',
    mail : '',
  };

  constructor(public dialog: MatDialog, public userDataService: UserDataService) {

  }

  ngOnInit(): void {
    

  }

  openDialog() {
    const dialog = this.dialog.open(DialogEdituserLogoutComponent, { position: { top: '100px', right: '50px' }, panelClass: 'custom-logout-dialog'});
  }
}
