import { Component } from '@angular/core';
import { confirmPasswordReset } from '@firebase/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { getAuth } from "firebase/auth";
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  newPassword: string = '';
  confirmPassword: string = '';
  oobCode: string;

  constructor(private router: ActivatedRoute, public appComponent: AppComponent) {
    this.oobCode = this.router.snapshot.queryParams['oobCode'] || null;
  }

  changePassword() {
    if (this.passwordsMatch()) {
      const auth = getAuth();
      const newPassword = this.newPassword;

      confirmPasswordReset(auth, this.oobCode, newPassword)
        .then((value) => {
          this.appComponent.showFeedback('Dein Passwort wurde erfolgreich geändert!')
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  passwordsMatch(): boolean {
    return this.newPassword === this.confirmPassword;
  }
}

