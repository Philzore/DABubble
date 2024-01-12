import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { UserDataService } from '../services/user-data.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private userDataService: UserDataService) { }

  saveDataForNextPage() {
    this.userDataService.setUserData({ name: this.name, email: this.email, password: this.password});
    this.router.navigate(['/choose-avatar']);
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
    if (this.nameFormControl.hasError('fullName')) {
      return 'Bitte gebe deinen Vor-und Nachnamen ein';
    }
    if (this.nameFormControl.hasError('minLength')) {
      return 'Vor-und Nachname sollten mindestens zwei Buchstaben haben';
    }
    return '';
  }

  // EMAIL VALIDIERUNG
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
  ]);
  getEmailErrorMessage() {
    return this.emailFormControl.hasError('pattern')
      ? 'Diese E-Mail-Adresse ist leider ungültig' : '';
  }

  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6), // Mindestens 6 Zeichen für das Passwort
  ]);
  getPasswordErrorMessage() {
    return this.passwordFormControl.hasError('minlength')
      ? 'Passwort sollte mindestens 6 Zeichen haben' : '';
  }

  privacyAcceptanceFormControl = new FormControl(false, [Validators.requiredTrue]);


  canSaveDataForNextPage(): boolean {
    return (
      this.emailFormControl.valid &&
      this.passwordFormControl.valid &&
      this.nameFormControl.valid &&
      this.privacyAcceptanceFormControl.value // Überprüfe, ob die Checkbox ausgewählt ist
    );
  }
  
}

