import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogEdituserLogoutComponent } from '../dialog-edituser-logout/dialog-edituser-logout.component';
import { UserDataService } from '../services/user-data.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-desktop-header',
  templateUrl: './desktop-header.component.html',
  styleUrls: ['./desktop-header.component.scss']
})
export class DesktopHeaderComponent implements OnInit {

  sidebarClose = false;
  currentUserName: string = '';


  constructor(public sharedService: SharedService,
    public dialog: MatDialog,
    public userDataService: UserDataService) {

  }

  ngOnInit(): void {
    this.sharedService.isSidebarOpen$().subscribe((state) => {
      this.sidebarClose = state;
    });
  }

  openDialog() {
    this.sharedService.unsubChannels();
    const dialog = this.dialog.open(DialogEdituserLogoutComponent, { position: { top: '100px', right: '50px' }, panelClass: 'custom-logout-dialog' });
  }

  closeSidebar() {
    this.sharedService.toggleSidebar();
  }

}
