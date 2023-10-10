import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-main-thread',
  templateUrl: './main-thread.component.html',
  styleUrls: ['./main-thread.component.scss']
})
export class MainThreadComponent {
toggleComponentB() {
throw new Error('Method not implemented.');
}

  @Input() showComponentB: boolean;
  

}
