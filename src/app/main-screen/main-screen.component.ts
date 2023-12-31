import { Component, EventEmitter, Input } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.scss'],
  animations: [
    trigger('enter', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('500ms', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)', opacity: 1 }),
        animate('500ms', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ]),
  ]
})
export class MainScreenComponent {
  viewState: string = 'all'; // Initialize with a default value
  activeChannel = '';
  OutputToogleThread ;

  @Input() changeChannel = new EventEmitter; 

  constructor(public sharedService: SharedService) {  }

  toogleThread(){
    if (this.sharedService.hideThreadWhenChangeChannel == false) {
      this.OutputToogleThread = !this.OutputToogleThread;
    }
    
  }

  hideThreadContainer() {  
    this.sharedService.availableThread = !this.sharedService.availableThread;
  }

}
