import { Component, EventEmitter, Input, Output, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { Message } from '../models/message.class';
import { UserDataService } from '../services/user-data.service';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';


@Component({
  selector: 'app-main-thread',
  templateUrl: './main-thread.component.html',
  styleUrls: ['./main-thread.component.scss']
})
export class MainThreadComponent {
  showAddDataPopup: boolean;
  showEmojiPopup: boolean;
  showPersonPopup: boolean;
  copiedText: string;
  threadContainerVisible: boolean; // Declare the property

  threadReady: boolean = false;
  threadMessage = new Message();

  @ViewChild('chatWrapper') private chatWrapper: ElementRef;

  constructor(
    public sharedService: SharedService,
    private userDataService: UserDataService,
    private firestore: Firestore,
    private renderer: Renderer2
  ) { }

  @Output() threadClosed = new EventEmitter<void>();

  ngOnInit() {
    this.sharedService.threadContainerVisibility$.subscribe(
      (visibility) => {
        this.threadContainerVisible = visibility;
      }
    );

    setTimeout(() => {
      this.threadReady = true;
    }, 300);

  }

  ngAfterViewChecked() {
    setTimeout(() => {
      this.scrollToBottom();
    }, 500);
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

  async sendThreadMessage() {
    this.threadMessage.from = this.userDataService.currentUser['name'];
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    this.threadMessage.time = formattedTime;
    this.threadMessage.text = this.copiedText;


    const threadRef = await addDoc(collection(this.firestore, this.sharedService.threadPath),
      this.threadMessage.toJSON()
    );
    this.copiedText = '';
  }

  

}
