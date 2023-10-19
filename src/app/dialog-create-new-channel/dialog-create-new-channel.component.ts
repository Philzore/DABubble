import { Component, inject } from '@angular/core';
import { Firestore, addDoc, collection, doc, setDoc } from '@angular/fire/firestore';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AppComponent } from '../app.component';


@Component({
  selector: 'app-dialog-create-new-channel',
  templateUrl: './dialog-create-new-channel.component.html',
  styleUrls: ['./dialog-create-new-channel.component.scss'],

})
export class DialogCreateNewChannelComponent {
  firestore: Firestore = inject(Firestore);

  channelName: string = '';
  channelDescription: string = '';

  constructor(public dialogRef: MatDialogRef<DialogCreateNewChannelComponent>, public appComponent:AppComponent) { }
  email = new FormControl('', [Validators.required, Validators.email]);

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  async saveNewChannel() {
    if (this.channelName.length >= 3) {
      await addDoc(collection(this.firestore, 'channels'), {
        name: this.channelName,
        description: this.channelDescription,
      }).then(() => {
        this.channelName = '';
        this.channelDescription = '';
      }).then(() =>{
        this.dialogRef.close();
      }).then(() => {
        this.appComponent.showFeedback('Channel created');
      });
    }
  }
}
