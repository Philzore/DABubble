import { Component, EventEmitter, Output, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { Message } from '../models/message.class';
import { UserDataService } from '../services/user-data.service';
import { Firestore, addDoc, collection, doc, updateDoc } from '@angular/fire/firestore';
import { MainChatComponent } from '../main-chat/main-chat.component';

@Component({
  selector: 'app-main-thread',
  templateUrl: './main-thread.component.html',
  styleUrls: ['./main-thread.component.scss'],
  
})
export class MainThreadComponent {
  showAddDataPopup: boolean;
  showEmojiPopup: boolean;
  showPersonPopup: boolean;
  selectedMessageId: string | null = null;
  copiedText: string = '';
  emojiMartVisible = false;
  threadContainerVisible: boolean; // Declare the property
  threadReady: boolean = false;
  threadMessage = new Message();
  showScrollButton = false;
  isSendingMessage = false;
  emojiMap: { [messageId: string]: string[] } = {};
  emojiCountMap: { [emoji: string]: number } = {};
  @Output() unsubThreadEvent = new EventEmitter<any>();
  @ViewChild('scrollButton') scrollButton: ElementRef;
  @ViewChild('chatWrapper') private chatWrapper: ElementRef;

  constructor(
    public sharedService: SharedService,
    private userDataService: UserDataService,
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
    }, 500);
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

  addEmoji(emoji: string) {
    this.copiedText += emoji['emoji']['native'];
    this.showEmojiPopup = false;
  }

  openEmojiForMessage(messageID?: string) {
    console.log('this is the message id of clicked message', messageID);
    if (this.selectedMessageId === messageID) {
      this.emojiMartVisible = false;
    } else {
      this.selectedMessageId = messageID;
    }
    this.emojiMartVisible = true;
  }

  addReactionToMessage(emoji: string, messageId: string) {
    if (this.selectedMessageId === messageId) {
        const existingEmojis = this.emojiMap[messageId] || [];
        const emojiNative = emoji['emoji']['native'];
        if(existingEmojis.includes(emojiNative) ) {
            this.emojiCountMap[emojiNative] = (this.emojiCountMap[emojiNative] || 0) + 1;
        } else {
          this.emojiMap[messageId] = [...existingEmojis, emojiNative];
          this.emojiCountMap[emojiNative] = 1;
        }
    }
    this.emojiMartVisible = false;
  }

  togglePersonPopup(): void {
    this.showPersonPopup = !this.showPersonPopup;
  }

  closeThread() {
    this.unsubThreadEvent.emit();
  }

  /**
   * add name to text are when click on @ symbol and the name
   * 
   * @param channelMember {string} - name of the channel member
   */
  addNameToTextArea(channelMember: string) {
    const channelMemberName = `@ ${channelMember} `;
    if(!this.copiedText.includes(channelMemberName)) {
      this.copiedText += channelMemberName;
    }
    this.showPersonPopup = false;
  }


  async sendThreadMessage() {
    if (this.copiedText.length >= 1) {
      this.isSendingMessage = true;
      this.threadMessage.from = this.userDataService.currentUser['name'];
      if (this.threadMessage.from == 'Gast') {
        this.threadMessage.profileImg = `./assets/characters/default_character.png`;
      } else {
        this.threadMessage.profileImg = `${this.userDataService.currentUser['imgNr']}`;
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
      await updateDoc(doc(this.firestore, this.sharedService.threadPath, threadRef.id),{
        id : threadRef.id ,
      });
      this.copiedText = '';
    }
    this.isSendingMessage = false;
  }

}
