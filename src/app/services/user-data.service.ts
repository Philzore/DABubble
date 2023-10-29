import { Injectable } from '@angular/core';
import { Auth, EmailAuthProvider, getAuth, reauthenticateWithCredential } from '@angular/fire/auth';


@Injectable({
  providedIn: 'root',
})



export class UserDataService {
  currentUser:object = {};


  constructor(private auth: Auth) { 
    this.currentUser = this.getFromLocalStorage('currentUser');
    console.log(this.currentUser);
  }
  private userData: { name: string, email: string, password: string } = { name: '', email: '', password: '' };
  
  

  setUserData(data: { name: string, email: string, password: string }) {
    this.userData = data;
  }

  getUserData() {
    return this.userData;
  }

  /**
   * save the stuff in the key 'currentUser'
   * 
   * @param object what you want to storage
   */
  saveCurrentUserLocalStorage(userName,userMail) {
    let object = {name : userName, mail:userMail}
    const objectString = JSON.stringify(object);
    localStorage.setItem('currentUser',objectString);
    this.currentUser = object;
  }

  /**
   * clear current user key in local storage
   * 
   */
  clearCurrentUserLocalStorage(){
    localStorage.removeItem('currentUser');
  }

  /**
   * save stuff in the local storage
   * 
   * @param key(string) key for the localStorage
   * @param object what you want to storage
   */
  saveToLocalStorage(key, object) {
    const objectString = JSON.stringify(object);
    localStorage.setItem(key,objectString);
  }

  /**
   * load stuff from the localStorage with the correct key
   * 
   * @param key(string) to load from the right part
   * @returns object from the given key
   */
  getFromLocalStorage(key){
    const storedObjectString = localStorage.getItem(key);
    const storedObjectAsJSON = JSON.parse(storedObjectString);
    return storedObjectAsJSON;
  }

  /**
   * get the current User from authentication
   * 
   * @returns name and mail from the current logged user or nothing if no user is logged in
   */
  getCurrentUser() {
    const user = this.auth.currentUser;
    if (user) {
      let currentUserEmail = user.email;
      let currentUserName = user.displayName;
      return { name : currentUserName, mail :currentUserEmail};
    } else {
      // No user is signed in.
      return {};
    }

  }

  /**
   * reauthentication with password if session is over 
   * 
   * @param password(string) password from user
   * @returns true or false , in dependency of success
   */
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