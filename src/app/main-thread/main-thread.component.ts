import { Component, EventEmitter, Input, Output, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { Message } from '../models/message.class';
import { UserDataService } from '../services/user-data.service';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { MainChatComponent } from '../main-chat/main-chat.component';


@Component({
  selector: 'app-main-thread',
  templateUrl: './main-thread.component.html',
  styleUrls: ['./main-thread.component.scss']
})
export class MainThreadComponent {
addReactionToMessage() {
throw new Error('Method not implemented.');
}
  showAddDataPopup: boolean;
  showEmojiPopup: boolean;
  showPersonPopup: boolean;
  selectedMessageId: string | null = null;
  copiedText: string = '';
  emojiMartVisible = false;
  threadContainerVisible: boolean; // Declare the property
  threadReady: boolean = false;
  threadMessage = new Message();
  @ViewChild('scrollButton') scrollButton: ElementRef;
  @ViewChild('chatWrapper') private chatWrapper: ElementRef;
  showScrollButton = false;
  isSendingMessage = false;

  @Output() unsubThreadEvent = new EventEmitter<any>();

  constructor(
    public sharedService: SharedService,
    private userDataService: UserDataService,
    private mainChat: MainChatComponent,
    private firestore: Firestore,
    private renderer: Renderer2
  ) { }

  // @Output() threadClosed = new EventEmitter<void>();

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

  scrollToBottom() {
    const container: HTMLElement = this.chatWrapper.nativeElement;
    container.scrollTop = container.scrollHeight;
  }

  onScroll(event: any) {
    if (event.target.offsetHeight + 50 + event.target.scrollTop >= event.target.scrollHeight) {
      this.showScrollButton = false;
    } else {
      this.showScrollButton = true;
    }
  }

  toggleAddDataPopup(): void {
    this.showAddDataPopup = !this.showAddDataPopup;
  }

  toggleEmojiPopup(): void {
    this.showEmojiPopup = !this.showEmojiPopup;
  }

  addEmoji(emoji:string) {
    this.copiedText += emoji['emoji']['native'];
  }

  toggleEmojiForMessage(messageID?: string) {
    if (this.selectedMessageId === messageID) {
      this.selectedMessageId = null; // Close the emoji-mart if it's already open for this message
    } else {
      this.selectedMessageId = messageID; // Open the emoji-mart for the selected message
    }
    this.emojiMartVisible = !this.emojiMartVisible;
  }

  togglePersonPopup(): void {
    this.showPersonPopup = !this.showPersonPopup;
  }

  closeThread() {
    this.unsubThreadEvent.emit();
  }

  async sendThreadMessage() {
    if (this.copiedText.length >= 1) {
      this.isSendingMessage = true;
      this.threadMessage.from = this.userDataService.currentUser['name'];
      if (this.threadMessage.from == 'Gast') {
        this.threadMessage.profileImg = `./assets/characters/default_character.png`;
      } else {
        this.threadMessage.profileImg = `./assets/characters/character_${this.userDataService.currentUser['imgNr']}.png`;
      }

      let date = new Date();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      this.threadMessage.calculatedTime = formattedTime;
      this.threadMessage.time = date;
      this.threadMessage.text = this.copiedText;


      const threadRef = await addDoc(collection(this.firestore, this.sharedService.threadPath),
        this.threadMessage.toJSON()
      );
      this.copiedText = '';
    }
    this.isSendingMessage = false;
  }

}
