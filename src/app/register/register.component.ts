import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { Firestore } from '@angular/fire/firestore';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  
  email: string = '';
  password: string = '';

  constructor(private router: Router) { }



  register(){
  

    const auth = getAuth();

    createUserWithEmailAndPassword(auth, this.email, this.password)
      .then((userCredential) => {
        // Registrierung erfolgreich
        const user = userCredential.user;
        console.log('User registered successfully')
        this.router.navigate(['/main-page']);
      })
      .catch((error) => {
        // Bei einem Fehler die Fehlermeldung anzeigen
        console.log('Error, User could not be registered')
      });
  }
}
