import { Component, EventEmitter, Output, Injectable, ViewChild, Input, OnInit } from '@angular/core'; // Import Injectable
import { MatDialog } from '@angular/material/dialog';
import { DialogCreateNewChannelComponent } from '../dialog-create-new-channel/dialog-create-new-channel.component';
import { trigger, state, style, animate, transition, sequence } from '@angular/animations';
import { Firestore, collection, getDocs, onSnapshot } from '@angular/fire/firestore';
import { SharedService } from '../shared.service';
import { AppComponent } from '../app.component';
import { UserDataService } from '../user-data.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('enterAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('500ms', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)', opacity: 1 }),
        animate('500ms', style({ transform: 'translateX(-100%)', opacity: 0 }))
      ])
    ]),
    trigger("dropDownMenu", [
      transition(":enter", [
        style({ height: 0, overflow: "hidden" }),
        sequence([
          animate("200ms", style({ height: "*" })),
        ])
      ]),
      transition(":leave", [
        style({ height: "*", overflow: "hidden" }),
        sequence([
          animate("200ms", style({ height: 0 }))
        ])
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(100%)' }),
        animate(500, style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateY(0)' }),
        animate(500, style({ opacity: 0, transform: 'translateY(-100%)' }))
      ])
    ])
  ]
})
export class SidebarComponent implements OnInit {

  @Output() sidebarToggled = new EventEmitter<boolean>();

  channelDropdown: boolean = false;
  messageDropdown: boolean = false;
  sidebarClose: boolean = false;

  workspaceText: string = 'schließen';
  channelsFromDataBase = [];
  usersFromDatabase = [];
  userData = [];

  constructor(public dialog: MatDialog, private sharedService: SharedService, private firestore: Firestore, public appComponent: AppComponent, public userDataService: UserDataService) {
    this.createSubscribeChannels();
    this.createSubscribeUsers();

  }

  ngOnInit():void {
    this.userData = this.userDataService.getCurrentUser();
  }

  async getChannelsFromDataBase() {
    this.channelsFromDataBase = [];
    const querySnapshotChannels = await getDocs(collection(this.firestore, 'channels'));
    querySnapshotChannels.forEach((doc) => {
      this.channelsFromDataBase.push(doc.data());
    });
  }

  async getUsersFromDatabase() {
    this.usersFromDatabase = [];
    const querySnapshotUsers = await getDocs(collection(this.firestore, 'users'));
    querySnapshotUsers.forEach((doc) => {
      this.usersFromDatabase.push(doc.data());
    });
  }

  createSubscribeChannels() {
    const unsubChannels = onSnapshot(collection(this.firestore, 'channels'), async (doc) => {
      await this.getChannelsFromDataBase();
    });
  }

  createSubscribeUsers() {
    const unsubUsers = onSnapshot(collection(this.firestore, 'users'), async (doc) => {
      await this.getUsersFromDatabase();
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogCreateNewChannelComponent, {
      panelClass: 'custom-normal-dialog',
      data: { user: this.userData },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.event == 'start') {
          this.appComponent.showFeedback('Channel created');
        }
      }
    });
  }

  openDropdownChannels() {
    this.channelDropdown = !this.channelDropdown;
  }

  openDropdownMessages() {
    this.messageDropdown = !this.messageDropdown;
  }

  closeSidebar() {
    this.sidebarClose = !this.sidebarClose;
    this.workspaceText = this.sidebarClose ? 'öffnen' : 'schließen';
    this.sharedService.toggleSidebar();
  }

  /* Open Channel */
  openChannel() {
    console.log('Click function to display the specific Channel that has been clicked on')
  }

}
