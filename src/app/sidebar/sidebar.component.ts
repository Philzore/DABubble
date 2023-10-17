import { Component, EventEmitter, Output, Injectable } from '@angular/core'; // Import Injectable
import { MatDialog } from '@angular/material/dialog';
import { DialogCreateNewChannelComponent } from '../dialog-create-new-channel/dialog-create-new-channel.component';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Firestore, collection, getDocs, onSnapshot } from '@angular/fire/firestore';
import { SharedService } from '../shared.service';

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
    ])
  ]
})
export class SidebarComponent {
  @Output() sidebarToggled = new EventEmitter<boolean>();

  channelDropdown: boolean = false;
  messageDropdown: boolean = false;
  sidebarClose: boolean = false;
  workspaceText: string = 'schließen';
  channelsFromDataBase = [];
  usersFromDatabase = [];


  constructor(public dialog: MatDialog, private sharedService: SharedService, private firestore:Firestore) {
    this.createSubscribeChannels();
    this.createSubscribeUsers();
  }

  async getChannelsFromDataBase() {
    this.channelsFromDataBase = [];
    const querySnapshotChannels = await getDocs(collection(this.firestore, 'channels'));
    querySnapshotChannels.forEach((doc) => {
      this.channelsFromDataBase.push(doc.data());
      // console.log(this.channelsFromDataBase);
    });
  }

  async getUsersFromDatabase() {
    this.usersFromDatabase = [];
    const querySnapshotUsers = await getDocs(collection(this.firestore, 'users'));
    querySnapshotUsers.forEach((doc) => {
      this.usersFromDatabase.push(doc.data());
      console.log(this.usersFromDatabase);
    });
  }

  createSubscribeChannels() {
    const unsubChannels = onSnapshot(collection(this.firestore, 'channels'), (doc) => {
      this.getChannelsFromDataBase();
    });
  }

  createSubscribeUsers() {
    const unsubUsers = onSnapshot(collection(this.firestore, 'users'), (doc) => {
      this.getUsersFromDatabase();
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogCreateNewChannelComponent, {
      panelClass: 'custom-normal-dialog',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
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
}
