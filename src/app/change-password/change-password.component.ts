import { Component } from '@angular/core';
import { getAuth, updatePassword } from "firebase/auth";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  newPassword: string = '';
  confirmPassword: string = '';

  changePassword() {
    const auth = getAuth();

    const user = auth.currentUser;
    const newPassword = this.newPassword;
    
    updatePassword(user, newPassword).then(() => {
      // Update successful.
      console.log('Password updated successfully');
    }).catch((error) => {
      // An error ocurred
      console.log(error);
      console.log('Password could not change, error');
    });
  }

  passwordsMatch(): boolean {
    return this.newPassword === this.confirmPassword;
  }
}

