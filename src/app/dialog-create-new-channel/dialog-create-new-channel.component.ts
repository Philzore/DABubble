import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-create-new-channel',
  templateUrl: './dialog-create-new-channel.component.html',
  styleUrls: ['./dialog-create-new-channel.component.scss'],

})
export class DialogCreateNewChannelComponent {


  constructor(public dialogRef: MatDialogRef<DialogCreateNewChannelComponent>) {}


  saveNewChannel() {
    
  }
}
