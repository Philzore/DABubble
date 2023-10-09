
import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogCreateNewChannelComponent } from '../dialog-create-new-channel/dialog-create-new-channel.component';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  
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

  }

}
