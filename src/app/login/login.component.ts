import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { signInAnonymously } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { AppComponent } from '../app.component';
import { UserDataService } from '../services/user-data.service';
import { User } from '../models/user.class';
import { Firestore, addDoc, collection, getDocs, query, where } from '@angular/fire/firestore';
import { SharedService } from '../services/shared.service';

RouterLink
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})


export class LoginComponent implements OnInit {
  hide = true;
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  user = new User();

  constructor(private router: Router,
    public appComponent: AppComponent,
    private userDataService: UserDataService,
    private firestore: Firestore,
    private sharedService: SharedService) { }


  ngOnInit(): void {
  }

  /**
   * check if enter key is pressed , if yes, send message
   * 
   * @param event 
   */
  onKeydown(event) {
    if (event.key === "Enter") {
      this.login();
    }
  }

  async login() {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, this.email, this.password)

      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        this.userDataService.saveCurrentUserLocalStorage(auth.currentUser.displayName, auth.currentUser.email, auth.currentUser.photoURL);
        this.router.navigate(['/main-page']);
      })
      .catch((error) => {
        this.errorMessage = 'Uncorrect Information. Please check your email and password';
      });
  }

  loginWithGoogle() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();


    signInWithPopup(auth, provider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        //Phil 
        this.userDataService.saveCurrentUserLocalStorage(auth.currentUser.displayName, auth.currentUser.email, auth.currentUser.photoURL);

        if (await this.checkIfUserExists(auth.currentUser.displayName)) {
          // Benutzer existiert bereits
          // Führe hier die entsprechenden Aktionen aus
        } else {
          // Benutzer existiert noch nicht
          // Führe hier die entsprechenden Aktionen aus
          this.user.name = auth.currentUser.displayName;
          this.user.email = auth.currentUser.email;
          this.user.avatar = auth.currentUser.photoURL;
          this.createUserWithFirebase();
        }
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        this.router.navigate(['/main-page']);
        this.sharedService.getChannelsFromDataBase('DaBubble');
        this.sharedService.createSubscribeChannelMessages();
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }


  async checkIfUserExists(loginUser) {
    const userRef = collection(this.firestore, 'users');
    const querySnapshot = await getDocs(query(userRef, where('name', '==', loginUser)));
    return querySnapshot.docs.length > 0;
  }

  createUserWithFirebase() {
    let usersCollection = collection(this.firestore, 'users');
    addDoc(usersCollection, this.user.toJSON())
      .then(() => {
      })
      .catch((error) => {
        console.error('Error adding user to Firestore', error);
      });
  }

  async loginAsGuest() {
    const auth = getAuth();
    this.appComponent.showFeedback('Hallo Gast!');
    signInAnonymously(auth)
      .then(() => {
        this.userDataService.saveCurrentUserLocalStorage('Gast', '', '');
        this.router.navigate(['/main-page']);
        // Signed in..
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ...
      });
  }

}