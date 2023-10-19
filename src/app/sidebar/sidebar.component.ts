import { Component, EventEmitter, Output, Injectable, ViewChild, ElementRef } from '@angular/core'; // Import Injectable
import { MatDialog } from '@angular/material/dialog';
import { DialogCreateNewChannelComponent } from '../dialog-create-new-channel/dialog-create-new-channel.component';
import { trigger, state, style, animate, transition, sequence } from '@angular/animations';
import { Firestore, collection, getDocs, onSnapshot } from '@angular/fire/firestore';
import { SharedService } from '../shared.service';
import { AppComponent } from '../app.component';

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
          style({opacity: 0 ,transform: 'translateY(100%)'}),
          animate(500, style({ opacity: 1 ,transform: 'translateY(0)'}))
        ]),
        transition(':leave', [
          style({ opacity: 1,transform: 'translateY(0)' }),
          animate(500, style({ opacity: 0,transform: 'translateY(-100%)' }))
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


  constructor(public dialog: MatDialog, private sharedService: SharedService, private firestore: Firestore, public appComponent:AppComponent) {
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
