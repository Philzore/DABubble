import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogEdituserLogoutComponent } from '../dialog-edituser-logout/dialog-edituser-logout.component';
import { UserDataService } from '../services/user-data.service';
import { SharedService } from '../services/shared.service';
import { getAuth } from 'firebase/auth';



@Component({
  selector: 'app-desktop-header',
  templateUrl: './desktop-header.component.html',
  styleUrls: ['./desktop-header.component.scss']
})
export class DesktopHeaderComponent implements OnInit {

  sidebarClose = false;
  currentUserName: string = '';
  // auth;

  constructor(
    public sharedService: SharedService,
    public dialog: MatDialog,
    public userDataService: UserDataService) {
  }

  /**
   * init component
   * 
   */
  ngOnInit(): void {
    this.sharedService.isSidebarOpen$().subscribe((state) => {
      this.sidebarClose = state;
    });

    // this.auth = getAuth();
  }

  /**
   * open dialog edit user logout
   * 
   */
  openDialog() {
    const dialog = this.dialog.open(DialogEdituserLogoutComponent, { position: { top: '100px', right: '50px' }, panelClass: 'custom-logout-dialog' });
  }

  /**
   * close sidebar
   * 
   */
  closeSidebar() {
    this.sharedService.toggleSidebar();
  }

}
