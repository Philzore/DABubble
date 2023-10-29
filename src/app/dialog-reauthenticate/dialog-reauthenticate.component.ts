import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogEditProfilComponent } from '../dialog-edit-profil/dialog-edit-profil.component';
import { UserDataService } from '../services/user-data.service';

@Component({
  selector: 'app-dialog-reauthenticate',
  templateUrl: './dialog-reauthenticate.component.html',
  styleUrls: ['./dialog-reauthenticate.component.scss']
})
export class DialogReauthenticateComponent {
  currentPassword: string = '';

  constructor(public dialogRef: MatDialogRef<DialogReauthenticateComponent>, public userDataService:UserDataService) { }

  reauthenticate() {
    // Führen Sie die Reauthentifizierung durch
    // Überprüfen Sie das Passwort und senden Sie 'success' oder 'error' an das Hauptdialogfenster
    // Je nach Ergebnis kann die Hauptkomponente die E-Mail-Adresse aktualisieren oder einen Fehler anzeigen
    // Sie müssen hier die Reauthentifizierungslogik implementieren
    // Zum Beispiel:
    if (this.userDataService.reAuthenticate(this.currentPassword)) {
      this.dialogRef.close({event : 'success'});
    } else {
      this.dialogRef.close({event : 'error'});
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
