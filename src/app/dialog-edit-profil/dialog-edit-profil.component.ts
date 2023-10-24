import { Component, OnInit } from '@angular/core';
import { Auth, EmailAuthProvider, reauthenticateWithCredential, updateEmail, updateProfile } from '@angular/fire/auth';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserDataService } from '../user-data.service';
import { user } from 'rxfire/auth';
import { Dialog } from '@angular/cdk/dialog';
import { DialogReauthenticateComponent } from '../dialog-reauthenticate/dialog-reauthenticate.component';
import { AppComponent } from '../app.component';


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

  nameChangeSuccessfull : boolean = false ;
  emailChangeSuccessfull : boolean = false ;

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<DialogEditProfilComponent>, public userDataService: UserDataService, private auth: Auth, public appComponent: AppComponent) {

  }

 ngOnInit(): void {
    this.userData = this.userDataService.getCurrentUser();
    console.log('UserData', this.userData);
  }


  saveUser() {
    const user = this.auth.currentUser;

    if (this.newEmail.includes('@') && this.newEmail.includes('.')) {
      this.refreshEmail(user);
      this.emailChangeSuccessfull = true ;
    }

    if (this.newName.length >= 4) {
      this.refreshDisplayName(user);
      this.nameChangeSuccessfull = true ;
    }


  }

  refreshEmail(user) {
    updateEmail(user, this.newEmail).then(() => {
      // Email updated!
      console.log('Email succesful updated to', this.newEmail);
      this.newEmail = '' ;
      this.appComponent.showFeedback('Daten erfolgrei geändert');
    }).catch((error) => {
      // An error occurred
      const dialogRef = this.dialog.open(DialogReauthenticateComponent, { width: '400px', panelClass: 'custom-normal-dialog' });
      dialogRef.afterClosed().subscribe((result) => {
        if (result.event == 'success') {
          updateEmail(user, this.newEmail).then(() => {
            this.newEmail = '' ;
          });
        }
      })
      console.log('There was an error to update your email', error);
    });
  }

  refreshDisplayName(user) {
    updateProfile(user, { displayName: this.newName }).then(() => {
      //Profil updated
      console.log('Name succesful updated to', this.newName);
      this.newName = '' ;
    }).catch((error) => {
      //
    });
  }

  reAuth() {
    const dialogRef = this.dialog.open(DialogReauthenticateComponent, { width: '400px', panelClass: 'custom-normal-dialog' });
  }
}
