import { Component } from '@angular/core';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  email: string = '';

  sendMailForPassword() {
    const auth = getAuth();
    sendPasswordResetEmail(auth, this.email)
      .then(() => {
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
