import { FlatTreeControl } from '@angular/cdk/tree';
import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { DialogCreateNewChannelComponent } from '../dialog-create-new-channel/dialog-create-new-channel.component';



@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
 channels = ['Entwicklerteam','Office-Team'] ;
 users = ['Hasan', 'Musti','Phil'];
 channelDropdown:boolean = false ;
 messageDropdown:boolean = false ;
  constructor(public dialog:MatDialog) {
   
  }

  openDialog() {
    const dialog = this.dialog.open(DialogCreateNewChannelComponent, {panelClass: 'test-dialog'}) ;
  }

  openDropdownChannels() {
    if (this.channelDropdown) {
      this.channelDropdown = false ;
    } else {
      this.channelDropdown = true ;
    }
  }

  openDropdownMessages() {
    if (this.messageDropdown) {
      this.messageDropdown = false ;
    } else {
      this.messageDropdown = true ;
    }
  }

}
