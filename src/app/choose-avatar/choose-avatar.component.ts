import { Component, ViewChild } from '@angular/core';
import { UserDataService } from '../services/user-data.service';
import { Router } from '@angular/router';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { User } from '../models/user.class';
import { updateProfile } from "firebase/auth";
import { AppComponent } from '../app.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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
  user = new User();

  selectedCharacterIndex: number | null = null; // Neue Variable, um den ausgewählten Index zu verfolgen

  selectedCharacter: SafeUrl | string = 'assets/characters/default_character.png'; // Standardcharakter
  
  characters: string[] = [
    'assets/characters/character_1.png',
    'assets/characters/character_2.png',
    'assets/characters/character_3.png',
    'assets/characters/character_4.png',
    'assets/characters/character_5.png',
    'assets/characters/character_6.png'
  ];

  selectCharacter(index: number) {
    this.selectedCharacterIndex = index;
    this.selectedCharacter = this.characters[index];
  }

  constructor(private userDataService: UserDataService, private router: Router, private firestore: Firestore, public appComponent: AppComponent, private sanitizer: DomSanitizer) { }

  createUserWithFirebase() {
    let usersCollection = collection(this.firestore, 'users');
    addDoc(usersCollection, this.user.toJSON())
      .then(() => {
        console.log('User added to Firestore successfully!');
      })
      .catch((error) => {
        console.error('Error adding user to Firestore', error);
      });
  }

  register() {
    const auth = getAuth();

    createUserWithEmailAndPassword(auth, this.email, this.password)
      .then((userCredential) => {
        this.appComponent.showFeedback('Du hast dich erfolgreich registriert!');
        const user = userCredential.user;
        // Registrierung erfolgreich

        console.log('User registered successfully');
        // Die Werte für Benutzerobjekt
        this.user.name = this.name;
        this.user.email = this.email;
        
        if (this.selectedCharacterIndex !== null) {
          this.user.avatar = (this.selectedCharacterIndex + 1).toString();
        }

        // Fügt Nutzer bei Firebase hinzu ( Collection )
        this.createUserWithFirebase();

        this.router.navigate(['']);

        // Aktualisiert den Anzeigenamen vom User in der Authentication
        updateProfile(auth.currentUser, {
          displayName: this.name,
          //Phil addes photoUrl
          photoURL : this.user.avatar,
        })
          .then(() => {
            // Anzeigenamen aktualisiert
            console.log('Display name updated successfully');
          })
          .catch((error) => {
            // Bei einem Fehler die Fehlermeldung anzeigen
            console.error('Error updating display name', error);
          });
      })
      .catch((error) => {
        // Bei einem Fehler die Fehlermeldung anzeigen
        console.error('Error during registration', error);
      });
  }

  ngOnInit() {
    const userData = this.userDataService.getUserData();
    this.email = userData.email;
    this.name = userData.name
    this.password = userData.password;
    console.log('User name:', userData);
  }

  @ViewChild('fileInput') fileInput: any;

  openFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Den Dateipfad in eine sichere URL umwandeln
      const fileURL = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(selectedFile));
      console.log('Ausgewählte Datei:', selectedFile);
      this.selectedCharacter = fileURL;
    }
  }
}
