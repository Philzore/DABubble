
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogUserProfilComponent } from '../dialog-user-profil/dialog-user-profil.component';
import { getAuth, signOut } from "firebase/auth";
import { Router } from '@angular/router';
import { UserDataService } from '../services/user-data.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-dialog-edituser-logout',
  templateUrl: './dialog-edituser-logout.component.html',
  styleUrls: ['./dialog-edituser-logout.component.scss']
})
export class DialogEdituserLogoutComponent implements OnInit {
  hideProfil:boolean ;

  constructor(
    public dialogRef: MatDialogRef<DialogEdituserLogoutComponent>,
    public dialog: MatDialog,
    private router: Router,
    private userDataService: UserDataService,
    private sharedService: SharedService) { }


  ngOnInit(): void {
    if (this.userDataService.currentUser['name'] == 'Gast') {
      this.hideProfil = true ;
    } else {
      this.hideProfil = false ;
    }
  }

  showProfil() {
    this.dialogRef.close();
    const dialog = this.dialog.open(DialogUserProfilComponent, { position: { top: '100px', right: '50px' }, panelClass: 'custom-logout-dialog' });

    
  }

  logOut() {
    const auth = getAuth();
    signOut(auth).then(() => {
      // Sign-out successful.
      this.dialogRef.close();
      this.userDataService.clearCurrentUserLocalStorage();
      this.router.navigate(['/']);
      this.sharedService.templateIsReady = false ;
      this.sharedService.unsubChannels();
      if (this.sharedService.unsubDirectChat){
        this.sharedService.unsubDirectChat();
      }
    }).catch((error) => {
      // An error happened.
    });
  }
}
