import { Component, OnInit } from '@angular/core';
import { Auth, updateEmail, updateProfile } from '@angular/fire/auth';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserDataService } from '../services/user-data.service';
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

  newName: string = '';
  newEmail: string = '';

  nameChangeSuccessfull: boolean = false;
  emailChangeSuccessfull: boolean = false;

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<DialogEditProfilComponent>,
    public userDataService: UserDataService, private auth: Auth, public appComponent: AppComponent) {

  }

  ngOnInit(): void {

  }

  /**
   * save user data if they are changed
   * 
   */
  saveUser() {
    const user = this.auth.currentUser;

    if (this.newEmail.includes('@') && this.newEmail.includes('.')) {
      this.refreshEmail(user);
      this.emailChangeSuccessfull = true;
    }

    if (this.newName.length >= 4) {
      this.refreshDisplayName(user);
      this.nameChangeSuccessfull = true;
    }
  }

  /**
   * update email 
   * 
   * @param user the current active user
   */
  refreshEmail(user) {
    updateEmail(user, this.newEmail).then(() => {
      // Email updated!
      console.log('Email succesful updated to', this.newEmail);
    }).catch((error) => {
      // An error occurred
      const dialogRef = this.dialog.open(DialogReauthenticateComponent, { width: '400px', panelClass: 'custom-normal-dialog' });
      dialogRef.afterClosed().subscribe((result) => {
        if (result.event == 'success') {
          updateEmail(user, this.newEmail).then(() => {
          });
        }
      })
      console.log('There was an error to update your email', error);
    });
  }

  /**
   * update user display name
   * 
   * @param user the current active user
   */
  refreshDisplayName(user) {
    updateProfile(user, { displayName: this.newName }).then(() => {
      //Profil updated
      console.log('Name succesful updated to', this.newName);
      //update LocalStorage
      this.userDataService.saveCurrentUserLocalStorage(this.newName,this.userDataService.currentUser['mail'],this.userDataService.currentUser['imgNr'])
    }).catch((error) => {
      //
    });
  }

  /**
   * open reauthentication dialog
   * 
   */
  reAuth() {
    const dialogRef = this.dialog.open(DialogReauthenticateComponent, { width: '400px', panelClass: 'custom-normal-dialog' });
  }
}
