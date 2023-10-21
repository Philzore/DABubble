import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-group-info-popup',
  templateUrl: './group-info-popup.component.html',
  styleUrls: ['./group-info-popup.component.scss']
})
export class GroupInfoPopupComponent {
saveChannelName() {
throw new Error('Method not implemented.');
}
isEditing = false;
channelName = 'Channelname';

changeChannelDescription() {
throw new Error('Method not implemented.');
}

changeChannelName() {
  this.isEditing = !this.isEditing;
  console.log(this.isEditing);

}

  constructor(public dialog: MatDialog) {}
  
}
