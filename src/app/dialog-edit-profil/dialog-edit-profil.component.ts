import { Component } from '@angular/core';
import { EmailAuthProvider, OAuthProvider, browserLocalPersistence, browserSessionPersistence, getAuth, onAuthStateChanged, reauthenticateWithCredential, reauthenticateWithPopup, updateEmail } from '@angular/fire/auth';
import { MatDialogRef } from '@angular/material/dialog';
import { UserDataService } from '../user-data.service';


@Component({
  selector: 'app-dialog-edit-profil',
  templateUrl: './dialog-edit-profil.component.html',
  styleUrls: ['./dialog-edit-profil.component.scss']
})
export class DialogEditProfilComponent {
  currentUserEmail: string = '';
  currentUserName: string = '';
  userData = [];
  newName: string = '';
  newEmail: string = '';
  auth = getAuth();

  constructor(public dialogRef: MatDialogRef<DialogEditProfilComponent>, public userDataService: UserDataService) {
    // this.getCurrentUser();
    this.userData = userDataService.getCurrentUser();
  }

  getCurrentUser() {

    const user = this.auth.currentUser;

    if (user) {
      this.currentUserEmail = user.email;
      this.currentUserName = user.displayName;
    } else {
      // No user is signed in.
    }
  }

  saveUser() {
    updateEmail(this.auth.currentUser, this.newEmail).then(() => {
      // Email updated!
      console.log('Email succesful updated to', this.newEmail);
    }).catch((error) => {
      // An error occurred
      console.log('There was an error to update your email', error);
      const provider = new OAuthProvider('google.com');
      provider.addScope('profile');
      provider.addScope('email');
      reauthenticateWithPopup(this.auth.currentUser, provider).then((result) => {
        console.log(result);

      }).catch((error) => {

      });


    });
  }
}
