import { Component, EventEmitter, Input, Output, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-main-thread',
  templateUrl: './main-thread.component.html',
  styleUrls: ['./main-thread.component.scss']
})
export class MainThreadComponent {
  showAddDataPopup: boolean;
  showEmojiPopup: boolean;
  showPersonPopup: boolean;
  copiedText: any;
  threadContainerVisible: boolean; // Declare the property
  @ViewChild('chatWrapper') private chatWrapper: ElementRef;

  constructor(
    private sharedService: SharedService,
    private renderer: Renderer2
    ) {}

  @Output() threadClosed = new EventEmitter<void>();

  ngOnInit() {
    this.sharedService.threadContainerVisibility$.subscribe(
      (visibility) => {
        this.threadContainerVisible = visibility;
      }
    );
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
      this.renderer.setProperty(this.chatWrapper.nativeElement, 'scrollTop', this.chatWrapper.nativeElement.scrollHeight);
  }

  toggleAddDataPopup(): void {
    this.showAddDataPopup = !this.showAddDataPopup;
  }

  toggleEmojiPopup(): void {
    this.showEmojiPopup = !this.showEmojiPopup;
  }

  togglePersonPopup(): void {
    this.showPersonPopup = !this.showPersonPopup;
  }

  closeThread() {
    console.log('close thread');
    this.threadClosed.emit();
  }

}
