import { Component, ViewChild } from '@angular/core';
import { UserDataService } from '../services/user-data.service';
import { Router } from '@angular/router';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { User } from '../models/user.class';
import { updateProfile } from 'firebase/auth';
import { AppComponent } from '../app.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { signInWithEmailAndPassword } from '@angular/fire/auth';
import {
  StringFormat,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from '@angular/fire/storage';

@Component({
  selector: 'app-choose-avatar',
  templateUrl: './choose-avatar.component.html',
  styleUrls: ['./choose-avatar.component.scss'],
})
export class ChooseAvatarComponent {
  userData = this.userDataService.getUserData();
  name: string = '';
  email = this.userData.email;
  password = this.userData.email;
  user = new User();

  selectedCharacterIndex: number | null = null; // Neue Variable, um den ausgewählten Index zu verfolgen

  selectedCharacter: string = 'assets/characters/default_character.png'; // Standardcharakter

  ownProfilePicture: string = '';

  characters: string[] = [
    'assets/characters/character_1.png',
    'assets/characters/character_2.png',
    'assets/characters/character_3.png',
    'assets/characters/character_4.png',
    'assets/characters/character_5.png',
    'assets/characters/character_6.png',
  ];

  selectCharacter(index: number) {
    this.selectedCharacterIndex = index;
    this.selectedCharacter = this.characters[index];
  }

  constructor(
    private userDataService: UserDataService,
    private router: Router,
    private firestore: Firestore,
    public appComponent: AppComponent,
    private sanitizer: DomSanitizer
  ) {}

  createUserWithFirebase() {
    let usersCollection = collection(this.firestore, 'users');
    addDoc(usersCollection, this.user.toJSON())
      .then(() => {})
      .catch((error) => {
        console.error('Error adding user to Firestore', error);
      });
  }

  register() {
    const auth = getAuth();
    

    createUserWithEmailAndPassword(auth, this.email, this.password)
      .then((userCredential) => {
        const user = userCredential.user;
        // Registrierung erfolgreich
        // Die Werte für Benutzerobjekt
        this.user.name = this.name;
        this.user.email = this.email;

        if (this.selectedCharacterIndex !== null) {
          this.user.avatar = this.characters[this.selectedCharacterIndex];
        } else if (this.ownProfilePicture) {
          // Wenn ownProfilePicture gesetzt ist, verwende es als Avatar
          this.user.avatar = this.ownProfilePicture;
        } else {
          // Fallback auf den Standard-Avatar, wenn keine Auswahl getroffen wurde
          this.user.avatar = 'default_avatar_url';
        }
        // Fügt Nutzer bei Firebase hinzu ( Collection )
        this.createUserWithFirebase();
        this.appComponent.showFeedback('Du hast dich erfolgreich registriert!');
        // Aktualisiert den Anzeigenamen vom User in der Authentication
        updateProfile(auth.currentUser, {
          displayName: this.name,
          photoURL: this.user.avatar,
        })
          .then(() => {
            // Anzeigenamen aktualisiert
          })
          .catch((error) => {
            // Bei einem Fehler die Fehlermeldung anzeigen
            console.error('Error updating display name', error);
          });

        this.login();
      })
      .catch((error) => {
        // Bei einem Fehler die Fehlermeldung anzeigen
        console.error('Error during registration', error);
      });
  }

  ngOnInit() {
    const userData = this.userDataService.getUserData();
    this.email = userData.email;
    this.name = userData.name;
    this.password = userData.password;
  }

  login() {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, this.email, this.password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        this.userDataService.saveCurrentUserLocalStorage(
          auth.currentUser.displayName,
          auth.currentUser.email,
          auth.currentUser.photoURL
        );
        this.router.navigate(['/main-page']);
      })
      .catch((error) => {});
  }

  @ViewChild('fileInput') fileInput: any;

  openFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];
    const storage = getStorage();

    // Create a storage reference
    const storageRef = ref(storage, `profile_pictures/${selectedFile.name}`);

    // Upload the file to Firebase Storage
    uploadBytes(storageRef, selectedFile).then((snapshot) => {

      getDownloadURL(snapshot.ref).then((url) => {
        this.selectedCharacter = url;
        this.ownProfilePicture = url;
        this.user.avatar = url;
      });
    });
  }
}
