import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';


@Injectable({
  providedIn: 'root',
})



export class UserDataService {

  constructor (private auth:Auth) {}
  private userData: { name: string, email: string, password: string } = { name: '', email: '', password: '' };

  setUserData(data: { name: string, email: string, password: string }) {
    this.userData = data;
  }

  getUserData() {
    return this.userData;
  }

  getCurrentUser() {
    
    const user = this.auth.currentUser;
    console.log('Nutzer', user);
    if (user) {
      let currentUserEmail = user.email;
      let currentUserName = user.displayName;
      return [currentUserName, currentUserEmail];
    } else {
      // No user is signed in.
      return [];
    }
  }
}