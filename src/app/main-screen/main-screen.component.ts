import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.scss']
})
export class MainScreenComponent {
  
  @Input() sidebarVisible: boolean = true;
  @Input() threadVisible: boolean = true;

  get isMainChatFullWidth(): boolean {
    return !this.sidebarVisible && !this.threadVisible;
  }

}
