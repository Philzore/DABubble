import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { AbstractControl, FormControl, ValidationErrors, Validators} from '@angular/forms';


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

// Vor- und Nachnamen Validierung
nameFormControl = new FormControl('', [
  Validators.required,
  this.validateFullName
]);

validateFullName(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value || value.trim() === '') {
    return { required: true };
  }
  const parts = value.trim().split(' ');
  if (parts.length < 2) {
    return { fullName: true };
  }
  const firstName = parts[0];
  const lastName = parts[1];
  if (firstName.length < 2 || lastName.length < 2) {
    return { minLength: true };
  }
  return null;
}

getNameErrorMessage() {
  if (this.nameFormControl.hasError('required')) {
    return 'You must enter a value';
  }
  if (this.nameFormControl.hasError('fullName')) {
    return 'Please enter both first and last names';
  }
  if (this.nameFormControl.hasError('minLength')) {
    return 'Both first and last names must have at least 2 characters';
  }
  return '';
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

