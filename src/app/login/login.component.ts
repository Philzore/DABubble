import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';


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
      });
  }


}