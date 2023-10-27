import { Component, EventEmitter, Input } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { SharedService } from '../shared.service';
import { browserLocalPersistence, getAuth, } from '@angular/fire/auth';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.scss']
})
export class MainScreenComponent {
  hideThread = true;
  viewState: string = 'all'; // Initialize with a default value
  activeChannel = '';
  @Input() changeChannel = new EventEmitter; 
  

  constructor(private sharedService: SharedService) {  }


  hideThreadContainer() {  
    this.hideThread = !this.hideThread;
  }

}
