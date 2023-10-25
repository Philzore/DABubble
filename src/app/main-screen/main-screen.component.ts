import { Component, Input } from '@angular/core';

import { browserLocalPersistence, getAuth, } from '@angular/fire/auth';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.scss']
})
export class MainScreenComponent {

  hideThread = false;
  
  constructor() {
    
    
  }

  hideThreadContainer() {  
    this.hideThread = !this.hideThread;
  }

}
