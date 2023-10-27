import { Component, inject,Output, EventEmitter, Inject, OnInit } from '@angular/core';
import { Firestore, addDoc, collection, doc, setDoc } from '@angular/fire/firestore';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppComponent } from '../app.component';
import { UserDataService } from '../user-data.service';


@Component({
  selector: 'app-dialog-create-new-channel',
  templateUrl: './dialog-create-new-channel.component.html',
  styleUrls: ['./dialog-create-new-channel.component.scss'],

})
export class DialogCreateNewChannelComponent implements OnInit{

  channelName: string = '';
  channelDescription: string = '';
  currentUser = '';

  constructor(public dialogRef: MatDialogRef<DialogCreateNewChannelComponent>,@Inject(MAT_DIALOG_DATA) public data, public appComponent:AppComponent, 
  public firestore:Firestore,public userDataService:UserDataService) { }
  // email = new FormControl('', [Validators.required, Validators.email]);

  // getErrorMessage() {
  //   if (this.email.hasError('required')) {
  //     return 'You must enter a value';
  //   }

  //   return this.email.hasError('email') ? 'Not a valid email' : '';
  // }

  ngOnInit() {
    this.currentUser = this.userDataService.currentUser['name'];
  }

  async saveNewChannel() {
    if (this.channelName.length >= 3) {
      /* added by hasan to display the channel name in main chat component */
      await addDoc(collection(this.firestore, 'channels'), {
        name: this.channelName,
        description: this.channelDescription,
        created: this.currentUser,
      }).then(() => {
        this.channelName = '';
        this.channelDescription = '';
      }).then(() =>{
        this.dialogRef.close({event : 'start'});
      })
    }
  }
}
