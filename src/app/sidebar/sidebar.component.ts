
import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogCreateNewChannelComponent } from '../dialog-create-new-channel/dialog-create-new-channel.component';
import {trigger,state,style,animate,transition,} from '@angular/animations';


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
  channels = ['Entwicklerteam', 'Office-Team'];
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

  constructor(public dialog: MatDialog) {
    console.log(this.users);
  }

  openDialog() {
    const dialog = this.dialog.open(DialogCreateNewChannelComponent,{panelClass: 'custom-normal-dialog'});
  }

  openDropdownChannels() {
    if (this.channelDropdown) {
      this.channelDropdown = false;
    } else {
      this.channelDropdown = true;
    }
  }

  openDropdownMessages() {
    if (this.messageDropdown) {
      this.messageDropdown = false;
    } else {
      this.messageDropdown = true;
    }
  }

  closeSidebar(){
    this.sidebarClose = !this.sidebarClose ;
    this.workspaceText = this.sidebarClose ? 'öffnen' : 'schließen';
  }

}
