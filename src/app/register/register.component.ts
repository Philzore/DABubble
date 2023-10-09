import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { FormControl, Validators} from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router) { }



  register() {

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

  // Name Validierung
  nameFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(2), // Mindestens 2 Zeichen für den Namen
  ]);

  getNameErrorMessage() {
    if (this.nameFormControl.hasError('required')) {
      return 'You must enter a value';
    }
    return this.nameFormControl.hasError('minlength')
      ? 'Must be at least 2 characters': '';
  }

  // EMAIL VALIDIERUNG
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  getEmailErrorMessage() {
    if (this.emailFormControl.hasError('required')) {
      return 'You must enter a value';
    }
    return this.emailFormControl.hasError('email')
     ? 'Not a valid email' : '';
  }

  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6), // Mindestens 6 Zeichen für das Passwort
  ]);
  getPasswordErrorMessage() {
    if (this.passwordFormControl.hasError('required')) {
      return 'You must enter a value';
    }
    return this.passwordFormControl.hasError('minlength')
      ? 'Must be at least 6 characters': '';
  }

  privacyAcceptanceFormControl = new FormControl(false, [Validators.requiredTrue]);

  canRegister(): boolean {
    return (
      this.emailFormControl.valid &&
      this.passwordFormControl.valid &&
      this.nameFormControl.valid &&
      this.privacyAcceptanceFormControl.value // Überprüfe, ob die Checkbox ausgewählt ist
    );
  }
}

