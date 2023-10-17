import { Component } from '@angular/core';
import { confirmPasswordReset } from '@firebase/auth';
import { ActivatedRoute } from '@angular/router';
import { getAuth } from "firebase/auth";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  newPassword: string = '';
  confirmPassword: string = '';
  oobCode: string;

  constructor(private router: ActivatedRoute){
    this.oobCode = this.router.snapshot.queryParams['oobCode'] || null;
  }

  changePassword() {
    if(this.passwordsMatch()){
      const auth = getAuth();
      const newPassword = this.newPassword;
  
      confirmPasswordReset(auth, this.oobCode, newPassword).then((value) => console.log(value, 'Changed password sucessfully'))
      .catch((err) => console.error(err));
    }
  }

  passwordsMatch(): boolean {
    return this.newPassword === this.confirmPassword;
  }
}

