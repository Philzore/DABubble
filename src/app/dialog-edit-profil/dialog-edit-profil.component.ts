import { Component, OnInit } from '@angular/core';
import { Auth, EmailAuthProvider, reauthenticateWithCredential, updateEmail } from '@angular/fire/auth';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserDataService } from '../user-data.service';
import { user } from 'rxfire/auth';
import { Dialog } from '@angular/cdk/dialog';
import { DialogReauthenticateComponent } from '../dialog-reauthenticate/dialog-reauthenticate.component';


@Component({
  selector: 'app-dialog-edit-profil',
  templateUrl: './dialog-edit-profil.component.html',
  styleUrls: ['./dialog-edit-profil.component.scss']
})
export class DialogEditProfilComponent implements OnInit {
  currentUserEmail: string = '';
  currentUserName: string = '';
  userData = [];
  newName: string = '';
  newEmail: string = '';
  currentPassword: string = '';

  constructor(public dialog:MatDialog ,public dialogRef: MatDialogRef<DialogEditProfilComponent>, public userDataService: UserDataService, private auth: Auth) {

  }

  ngOnInit(): void {
    this.userData = this.userDataService.getCurrentUser();
    console.log('UserData', this.userData);
  }


  saveUser() {
    const user = this.auth.currentUser;
    
    updateEmail(user, this.newEmail).then(() => {
      // Email updated!
      console.log('Email succesful updated to', this.newEmail);
    }).catch((error) => {
      // An error occurred
      const dialogRef = this.dialog.open(DialogReauthenticateComponent);
      
      console.log('There was an error to update your email', error);
      const emailAuthProvider = EmailAuthProvider.credential(user.email, this.currentPassword);
      reauthenticateWithCredential(user, emailAuthProvider).then(() => {
        console.log('Reauthentication succesful');
      }).catch((error) => {
        console.log('Reauthenticate error :', error);
      });

    });
  }
}
