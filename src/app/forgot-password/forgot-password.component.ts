import { Component } from '@angular/core';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  constructor(public appComponent:AppComponent){}
  email: string = '';

  sendMailForPassword() {
    const auth = getAuth();
    sendPasswordResetEmail(auth, this.email)
      .then(() => {
        this.appComponent.showFeedback('Email wurde erfolgreich gesendet!')
        console.log('Email to reset password was sent')
        // Password reset email sent!
        // ..
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  }
}
