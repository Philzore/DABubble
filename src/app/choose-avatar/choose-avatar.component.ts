import { Component, ViewChild } from '@angular/core';
import { UserDataService } from '../user-data.service';
import { Router } from '@angular/router';
import { createUserWithEmailAndPassword, getAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-choose-avatar',
  templateUrl: './choose-avatar.component.html',
  styleUrls: ['./choose-avatar.component.scss']
})
export class ChooseAvatarComponent {
  userData = this.userDataService.getUserData();
  name: string = '';
  email = this.userData.email;
  password = this.userData.email;

  @ViewChild('fileInput') fileInput: any;


  constructor(private userDataService: UserDataService, private router: Router) { }

  register() {
    console.log('', this.email, this.password)
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, this.email, this.password)
      .then((userCredential) => {
        // Registrierung erfolgreich
        const user = userCredential.user;
        console.log('User registered successfully');
        this.router.navigate(['/main-page']);
      })
      .catch((error) => {
        // Bei einem Fehler die Fehlermeldung anzeigen
        console.error('Error during registration', error);
      });
  }


  ngOnInit() {
    const userData = this.userDataService.getUserData();
    this.email = userData.email; // Setze die E-Mail
    this.name = userData.name
    this.password = userData.password; // Setze das Passwort
    console.log('User name:', userData);
  }


  openFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Hier kannst du die ausgewählte Datei weiterverarbeiten, z.B. hochladen oder anzeigen
      console.log('Ausgewählte Datei:', selectedFile);
    }
  }
}
