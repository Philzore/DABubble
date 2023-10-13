
import { Component, EventEmitter, Output, ViewChild, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogCreateNewChannelComponent } from '../dialog-create-new-channel/dialog-create-new-channel.component';
import {trigger,state,style,animate,transition, query,} from '@angular/animations';
import { SharedService } from 'src/shared.service';
import { Firestore, collection, doc, getDocs, onSnapshot } from '@angular/fire/firestore';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [ trigger(
    'enterAnimation', [
      transition(':enter', [
        style({transform: 'translateX(-100%)', opacity: 0}),
        animate('500ms', style({transform: 'translateX(0)', opacity: 1}))
      ]),
      transition(':leave', [
        style({transform: 'translateX(0)', opacity: 1}),
        animate('500ms', style({transform: 'translateX(-100%)', opacity: 0}))
      ])
    ]
  )
],
})
export class SidebarComponent {

  @Output() widthChange = new EventEmitter<number>();

  users = [{
    name: 'Hasan',
    img: '/assets/characters/character_2.png',
  },
  {
    name: 'Musti',
    img: '/assets/characters/character_3.png',
  },
  {
    name: 'Phil',
    img: '/assets/characters/character_4.png',
  },
  ];

  channelDropdown: boolean = false;
  messageDropdown: boolean = false;
  sidebarClose:boolean = false;
  workspaceText:string = 'schließen' ;
  channelsFromDataBase = [];

  firestore: Firestore = inject(Firestore);

  constructor(public dialog: MatDialog, private sharedService: SharedService) {
    this.createSubscribe();
  }

  async getChannelsFromDataBase() {
    this.channelsFromDataBase = [];
    const querySnapshot = await getDocs(collection(this.firestore, "channels"));
    querySnapshot.forEach((doc) => {
      this.channelsFromDataBase.push(doc.data());
      console.log(this.channelsFromDataBase);
    });
  }

  createSubscribe() {
    const unsub = onSnapshot(collection(this.firestore, "channels"), (doc) => {
      this.getChannelsFromDataBase();
  });
  }

  openDialog() {
    const dialog = this.dialog.open(DialogCreateNewChannelComponent,{panelClass: 'custom-normal-dialog'});
  }

  openDropdownChannels() {
    this.channelDropdown = !this.channelDropdown ;
  }

  openDropdownMessages() {
    this.messageDropdown = !this.messageDropdown;
  }

  closeSidebar(){
    this.sidebarClose = !this.sidebarClose ;
    this.workspaceText = this.sidebarClose ? 'öffnen' : 'schließen';
  }

}
