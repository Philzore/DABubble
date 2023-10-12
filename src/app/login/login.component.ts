import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { signInAnonymously } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

RouterLink
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  hide = true;
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router) { }

  login() {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, this.email, this.password)

      .then((userCredential) => {
        // Signed in
        console.log('User loged in successfully')
        const user = userCredential.user;
        this.router.navigate(['/main-page']);
      })
      .catch((error) => {
        console.log('User could not log in');
        this.errorMessage = 'Uncorrect Information. Please check your email and password';
      });
  }

  loginWithGoogle() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        console.log('Google Login worked sucessfully')
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        this.router.navigate(['/main-page']);
      }).catch((error) => {
        console.log('Google Login Failed, Login does not work')
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

  loginAsGuest() {
    const auth = getAuth();
    signInAnonymously(auth)
      .then(() => {
        console.log('User logged in as Guest successfully')
        this.router.navigate(['/main-page']);
        // Signed in..
      })
      .catch((error) => {
        console.log('ERROR, User could NOT log in as Guest')
        const errorCode = error.code;
        const errorMessage = error.message;
        // ...
      });
  }
}