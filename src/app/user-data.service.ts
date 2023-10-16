import { Injectable } from '@angular/core';
import { getAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})

export class UserDataService {
  private userData: { name: string, email: string, password: string } = { name: '', email: '', password: '' };

  setUserData(data: { name: string, email: string, password: string }) {
    this.userData = data;
  }

  getUserData() {
    return this.userData;
  }

  getCurrentUser() {
    const auth = getAuth() ;
    const user = auth.currentUser;
    
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