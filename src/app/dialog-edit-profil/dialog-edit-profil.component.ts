import { Component } from '@angular/core';
import {  EmailAuthProvider,  browserLocalPersistence, browserSessionPersistence, getAuth, onAuthStateChanged, reauthenticateWithCredential, reauthenticateWithPopup, updateEmail } from '@angular/fire/auth';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-edit-profil',
  templateUrl: './dialog-edit-profil.component.html',
  styleUrls: ['./dialog-edit-profil.component.scss']
})
export class DialogEditProfilComponent {
  currentUserEmail: string = '';
  currentUserName: string = '';
  newName: string = '';
  newEmail: string = '';
  auth = getAuth();

  constructor(public dialogRef: MatDialogRef<DialogEditProfilComponent>) {
    this.getCurrentUser();
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
      const provider =new EmailAuthProvider;
      
      reauthenticateWithPopup(this.auth.currentUser, provider).then(() => {
        // User re-authenticated.
      }).catch((error) => {
        // An error ocurred
        // ...
      });

    });
  }
}
