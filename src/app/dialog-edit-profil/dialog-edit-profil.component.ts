import { Component, OnInit } from '@angular/core';
import { Auth, updateEmail, updateProfile } from '@angular/fire/auth';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserDataService } from '../services/user-data.service';
import { DialogReauthenticateComponent } from '../dialog-reauthenticate/dialog-reauthenticate.component';
import { AppComponent } from '../app.component';
import { SharedService } from '../services/shared.service';
import { Firestore, collection, doc, getDoc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';


@Component({
  selector: 'app-dialog-edit-profil',
  templateUrl: './dialog-edit-profil.component.html',
  styleUrls: ['./dialog-edit-profil.component.scss']
})
export class DialogEditProfilComponent implements OnInit {
  currentUserEmail: string = '';
  currentUserName: string = '';

  oldName: string = '';
  newName: string = '';
  newEmail: string = '';

  nameChangeSuccessfull: boolean = false;
  emailChangeSuccessfull: boolean = false;

  constructor(public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogEditProfilComponent>,
    public userDataService: UserDataService,
    private sharedService: SharedService,
    private auth: Auth,
    public appComponent: AppComponent,
    private firestore: Firestore) {

  }

  ngOnInit(): void {
    this.oldName = this.userDataService.currentUser['name'] ;
    this.newName = this.userDataService.currentUser['name'];
    this.newEmail = this.userDataService.currentUser['mail'];
  }

  /**
   * save user data if they are changed
   * 
   */
  saveUser() {
    const user = this.auth.currentUser;
    let emailChanged = false;
    let nameChanged = false;

    if (this.newEmail.includes('@') && this.newEmail.includes('.')) {
      if (this.newEmail !== this.userDataService.currentUser['mail']) {
        this.refreshEmail(user);
        emailChanged = true;
      }

      if (emailChanged) {
        this.emailChangeSuccessfull = true;
      }
    }

    if (this.newName.length >= 4 && this.newName !== this.userDataService.currentUser['name']) {
      this.refreshDisplayName(user);
      nameChanged = true;

      if (nameChanged) {
        this.nameChangeSuccessfull = true;
      }
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
      //update LocalStorage
      this.userDataService.saveCurrentUserLocalStorage(this.userDataService.currentUser['name'], this.newEmail, this.userDataService.currentUser['imgNr'])
    }).catch((error) => {
      // An error occurred
      const dialogRef = this.dialog.open(DialogReauthenticateComponent, { width: '400px', panelClass: 'custom-normal-dialog' });
      dialogRef.afterClosed().subscribe((result) => {
        if (result.event == 'success') {
          updateEmail(user, this.newEmail).then(() => {
          });
        }
      })
    });
  }

  /**
   * update user display name
   * 
   * @param user the current active user
   */
  async refreshDisplayName(user) {
    updateProfile(user, { displayName: this.newName }).then(async () => {
      //Profil updated
      await this.sharedService.updateName(this.oldName,this.newName);
      //update LocalStorage
      this.userDataService.saveCurrentUserLocalStorage(this.newName, this.userDataService.currentUser['mail'], this.userDataService.currentUser['imgNr']);
      //update users in Database
      await this.updateUserInDatabase();
      this.oldName = this.newName ;
    }).catch((error) => {
      //
    });
  }

  async updateUserInDatabase() {
    const userRef = collection(this.firestore, 'users');
    const userQuery = query(userRef, where("name", "==", this.oldName));
    const querySnapshotUser = await getDocs(userQuery);

    for (const userDoc of querySnapshotUser.docs){
      const singleUser = doc(this.firestore, 'users', userDoc.id)
      await updateDoc(singleUser, {
        name : this.newName,
      });
    }

  }

  /**
   * open reauthentication dialog
   * 
   */
  reAuth() {
    const dialogRef = this.dialog.open(DialogReauthenticateComponent, { width: '400px', panelClass: 'custom-normal-dialog' });
  }
}
