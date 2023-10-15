import { Component, Input } from '@angular/core';

import { browserLocalPersistence, getAuth, } from '@angular/fire/auth';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.scss']
})
export class MainScreenComponent {

  @Input() sidebarVisible: boolean = true;
  @Input() threadVisible: boolean = true;

  constructor() {
    // const auth = getAuth();
    // auth.setPersistence(browserLocalPersistence);
    
  }

  get isMainChatFullWidth(): boolean {
    return !this.sidebarVisible && !this.threadVisible;
  }

}
