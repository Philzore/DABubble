import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { SharedService } from '../services/shared.service';
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
  OutputToogleThread ;

  @Input() changeChannel = new EventEmitter; 
  // @Output() OutputToogleThread = new EventEmitter<any>();

  constructor(private sharedService: SharedService) {  }

  toogleThread(){
    console.log('Toggle in main');
    
    // this.OutputToogleThread.emit();
    this.OutputToogleThread = !this.OutputToogleThread;
  }

  hideThreadContainer() {  
    this.hideThread = !this.hideThread;
  }

}
