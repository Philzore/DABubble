import { Injectable } from '@angular/core';
import { Auth, EmailAuthProvider, getAuth, reauthenticateWithCredential, signInWithEmailAndPassword } from '@angular/fire/auth';


@Injectable({
  providedIn: 'root',
})



export class UserDataService {
  currentUser:object = [];

  constructor(private auth: Auth) { 
    console.log('constructor');
    this.currentUser = this.getFromLocalStorage('userData');
    console.log(this.currentUser);
  }
  private userData: { name: string, email: string, password: string } = { name: '', email: '', password: '' };
  
  

  setUserData(data: { name: string, email: string, password: string }) {
    this.userData = data;
  }

  getUserData() {
    return this.userData;
  }

  saveToLocalStorage(key, object) {
    const objectString = JSON.stringify(object);
    localStorage.setItem(key,objectString);
  }

  getFromLocalStorage(key){
    const storedObjectString = localStorage.getItem(key);
    const storedObjectAsJSON = JSON.parse(storedObjectString);
    return storedObjectAsJSON;
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

  reAuthenticate(password: string): boolean {
    let reAuthenticateSuccess = false;
    const auth = getAuth();

    const emailAuthProvider = EmailAuthProvider.credential(this.auth.currentUser.email, password);
    reauthenticateWithCredential(this.auth.currentUser, emailAuthProvider).then(() => {
      console.log('Reauthentication succesful');
      reAuthenticateSuccess = true;
    }).catch((error) => {
      console.log('Reauthenticate error :', error);
      reAuthenticateSuccess = false;
    });
    return reAuthenticateSuccess;
  }
}