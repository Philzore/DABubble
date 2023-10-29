import { Component, inject, Output, EventEmitter, Inject, OnInit } from '@angular/core';
import { Firestore, addDoc, collection, doc, setDoc } from '@angular/fire/firestore';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppComponent } from '../app.component';
import { UserDataService } from '../services/user-data.service';
import { Channel } from '../models/channel.class';


@Component({
  selector: 'app-dialog-create-new-channel',
  templateUrl: './dialog-create-new-channel.component.html',
  styleUrls: ['./dialog-create-new-channel.component.scss'],

})
export class DialogCreateNewChannelComponent implements OnInit {

  channelName: string = '';
  channelDescription: string = '';
  currentUser = '';
  newChannel: Channel = new Channel();
  errChannelExist = false;

  constructor(
    public dialogRef: MatDialogRef<DialogCreateNewChannelComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public appComponent: AppComponent,
    public firestore: Firestore,
    public userDataService: UserDataService) { }


/**
 * save the currennt active user in variable
 * 
 */
  ngOnInit() {
    this.currentUser = this.userDataService.currentUser['name'];
  }

  /**
   * save the new channel in the Database
   * check if the channel exist
   * check if there are more then three letters
   * 
   */
  async saveNewChannel() {
    this.checkChannelExist();
    if (!this.errChannelExist) {
      if (this.channelName.length >= 3) {
        this.newChannel.name = this.channelName;
        this.newChannel.description = this.channelDescription;
        this.newChannel.created = this.currentUser;
        this.newChannel.members.push(this.currentUser);
        console.log(this.newChannel);
        /* added by hasan to display the channel name in main chat component */
        await addDoc(collection(this.firestore, 'channels'),
          this.newChannel.toJSON()
        ).then(() => {
          this.channelName = '';
          this.channelDescription = '';
        }).then(() => {
          this.dialogRef.close({ event: 'start' });
        })
      }
    }
  }

  /**
   * check if the channel already exist
   * it should not possible to create two times the same channel
   * 
   */
  checkChannelExist() {
    this.errChannelExist = false;
    let currentInput = this.channelName;
    let lowerInput = currentInput.toLowerCase();

    this.data.channels.forEach((element) => {
      let nameToLower = element.name.toLowerCase();
      if (nameToLower == lowerInput) {
        this.errChannelExist = true;
      }
    });


  }
}
