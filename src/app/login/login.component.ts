import { animate, style, transition, trigger } from '@angular/animations';
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
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({opacity: 0 ,transform: 'translateY(100%)'}),
        animate(500, style({ opacity: 1 ,transform: 'translateY(0)'}))
      ]),
      transition(':leave', [
        style({ opacity: 1,transform: 'translateY(0)' }),
        animate(500, style({ opacity: 0,transform: 'translateY(-100%)' }))
      ])
    ])
  ]
})


export class LoginComponent {
  hide = true;
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  activateFadeIn: boolean = false;
  activateFadeInOverlay:boolean = false ;
  fadeInText:string = '';

  
  constructor(private router: Router) {}

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
    this.showFeedback('Hallo Gast!')
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


  

  showFeedback(message:string) {
    this.activateFadeInOverlay = this.activateFadeInOverlay ? false : true ;
    this.activateFadeIn = this.activateFadeIn ? false : true ;
    this.fadeInText = message ;
  }

  removeOverlay(){
    setTimeout(() => {
      this.activateFadeInOverlay = false ;
    }, 2000);
    setTimeout(() => {
      this.activateFadeIn = false ;
    }, 1000);
  }
  
}