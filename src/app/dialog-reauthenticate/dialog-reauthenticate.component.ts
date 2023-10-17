import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogEditProfilComponent } from '../dialog-edit-profil/dialog-edit-profil.component';

@Component({
  selector: 'app-dialog-reauthenticate',
  templateUrl: './dialog-reauthenticate.component.html',
  styleUrls: ['./dialog-reauthenticate.component.scss']
})
export class DialogReauthenticateComponent {
  currentPassword: string = '';

  constructor(public dialogRef: MatDialogRef<DialogReauthenticateComponent>) { }

  reauthenticate() {
    // Führen Sie die Reauthentifizierung durch
    // Überprüfen Sie das Passwort und senden Sie 'success' oder 'error' an das Hauptdialogfenster
    // Je nach Ergebnis kann die Hauptkomponente die E-Mail-Adresse aktualisieren oder einen Fehler anzeigen
    // Sie müssen hier die Reauthentifizierungslogik implementieren
    // Zum Beispiel:
    if (this.validPassword(this.currentPassword)) {
      this.dialogRef.close('success');
    } else {
      this.dialogRef.close('error');
    }
  }

  closeDialog() {
    this.dialogRef.close('cancel');
  }


  validPassword(password: string) {
    // Hier können Sie Ihre Überprüfungslogik für das Passwort einfügen
    // Zum Beispiel: Überprüfung mit Firebase Authentication
    return true; // Ändern Sie dies entsprechend Ihrer Logik
  }
}
