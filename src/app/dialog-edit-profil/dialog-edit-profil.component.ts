import { Component, OnInit } from '@angular/core';
import { Auth, EmailAuthProvider, OAuthProvider, browserLocalPersistence, browserSessionPersistence, getAuth, onAuthStateChanged, reauthenticateWithCredential, reauthenticateWithPopup, updateEmail } from '@angular/fire/auth';
import { MatDialogRef } from '@angular/material/dialog';
import { UserDataService } from '../user-data.service';
import { user } from 'rxfire/auth';


@Component({
  selector: 'app-dialog-edit-profil',
  templateUrl: './dialog-edit-profil.component.html',
  styleUrls: ['./dialog-edit-profil.component.scss']
})
export class DialogEditProfilComponent implements OnInit{
  currentUserEmail: string = '';
  currentUserName: string = '';
  userData = [];
  newName: string = '';
  newEmail: string = '';
  

  constructor(public dialogRef: MatDialogRef<DialogEditProfilComponent>, public userDataService: UserDataService, private auth:Auth) {
    
  }

  ngOnInit(): void {
    this.userData = this.userDataService.getCurrentUser();
    console.log('UserData', this.userData);
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
