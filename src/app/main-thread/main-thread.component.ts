import { Component, EventEmitter, Output, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { Message } from '../models/message.class';
import { UserDataService } from '../services/user-data.service';
import { Firestore, addDoc, collection, doc, increment, runTransaction, updateDoc } from '@angular/fire/firestore';
import { getStorage, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage'


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
  filePreview: string | ArrayBuffer | null = null;
  lastDisplayedDate: string | null = null;
  fileUploadedThread:boolean = false;

  constructor(
    public sharedService: SharedService,
    public userDataService: UserDataService,
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

  uploadImagesThread(event: any) {
    const storage = getStorage();
    const files = event.target.files;
    if (!files) return;
  
    // Loop through each file and upload it
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Create a storage reference
      const storageRef = ref(storage, `images/${file.name}`);
  
      // Upload the file to Firebase Storage
      uploadBytes(storageRef, file).then((snapshot) => {

        // If you want to get the URL of the uploaded file
        getDownloadURL(snapshot.ref).then((url) => {
          this.threadMessage.imageUrl = url;
          this.threadMessage.fileUploaded = true;
          this.fileUploadedThread = true; // Set to true when a file is successfully uploaded
          setTimeout(() => {
          this.scrollToBottom();
          }, 500);
          // Here you might want to update your database or UI with the new image URL
        });
      }).catch((error) => {
        console.error("Upload failed", error);
        // Handle unsuccessful uploads
      });
    }
  }

  resetUploadThread() {
    this.threadMessage.fileUploaded = false;
    this.fileUploadedThread = false;
    this.copiedText = '';
  }


  /**
   * check if enter key is pressed , if yes, send message
   * 
   * @param event 
   */
  onKeydown(event, value: string) {
    if ((event.key === "Enter") && (this.copiedText.length >= 1) && !this.isWhitespace(this.copiedText)) {
      //to avoid the default action what would be the line break
      event.preventDefault();
      this.sendThreadMessage();
    }
    if (event.key === '@') {
      this.showPersonPopup = true;
    }
  }

  scrollToBottom() {
    const container: HTMLElement = this.chatWrapper.nativeElement;
    container.scrollTop = container.scrollHeight;
  }

  onScroll(event: any) {
    const target = event.target;
    // Check if the content height is greater than the container's height
    const hasScrollableContent = target.scrollHeight > target.offsetHeight;
    // Check if the user is near the bottom of the content
    const isNearBottom = target.offsetHeight + 50 + target.scrollTop >= target.scrollHeight;
  
    // Show the scroll button only if there's content to scroll and the user isn't near the bottom
    this.showScrollButton = hasScrollableContent && !isNearBottom;
  }

  insideClick(event: Event) {
    event.stopPropagation(); // Prevent click from reaching the document
  }

  /**
   * open add Data dialog in chat
   * 
   */
  toggleAddDataPopup(): void {
    this.insideClick(event) ;
    this.showAddDataPopup = !this.showAddDataPopup;
    this.showEmojiPopup = false;
    this.showPersonPopup = false;
  }


    /**
   * open emoji dialog in chat
   * 
   */
    toggleEmojiPopup(): void {
      this.insideClick(event) ;
      this.showEmojiPopup = !this.showEmojiPopup;
      this.showAddDataPopup = false;
      this.showPersonPopup = false;
    }
  
    /**
     * open person dialog in chat
     * 
     */
    togglePersonPopup(): void {
      this.insideClick(event) ;
      this.showPersonPopup = !this.showPersonPopup;
      this.showAddDataPopup = false;
      this.showEmojiPopup = false;
    }
  
    closePopUps() {
      this.emojiMartVisible = false;
      this.showAddDataPopup = false;
      this.showEmojiPopup = false;
      this.showPersonPopup = false;
      
    }

  addEmoji(emoji: string) {
    this.copiedText += emoji['emoji']['native'];
    this.showEmojiPopup = false;
  }

  openEmojiForMessage(messageID?: string) {
    this.insideClick(event) ;
    if (this.selectedMessageId === messageID) {
      this.emojiMartVisible = !this.emojiMartVisible;
    } else {
      this.selectedMessageId = messageID;
      this.emojiMartVisible = true;
    }
  }

  async addReactionToThreadMessage(emoji: string, messageId: string) {
    let channelId = this.sharedService.filteredChannels[1];
    const singleRef = doc(this.firestore, 'channels', channelId);

    const messageRef = doc(this.firestore, this.sharedService.threadPath, messageId);
    await runTransaction(this.firestore, async (transaction) => {
      // Retrieve existing reactions from Firebase
      const messageSnapshot = await transaction.get(messageRef);
      const existingReactions = messageSnapshot.data()?.['reactions'] || [];
      const exisitingsReactionsCount = messageSnapshot.data()?.['reactionsCount'] || {};

      // Your existing logic for updating local emoji map and count+
      if (this.selectedMessageId === messageId) {
        const emojiNative = emoji['emoji']['native'];
        if (existingReactions.includes(emojiNative)) {
          exisitingsReactionsCount[emojiNative] = (exisitingsReactionsCount[emojiNative] || 0) + 1;
        } else {
          this.emojiMap[messageId] = [...existingReactions, emojiNative];
          exisitingsReactionsCount[emojiNative] = 1;
        }
        (this.threadMessage.reactions as string[]) = this.emojiMap[messageId];
      }

      transaction.update(messageRef, {
        reactions: this.emojiMap[messageId],
        reactionsCount: exisitingsReactionsCount,
      });
    });
    this.emojiMartVisible = false;
  }

  closeThread() {
    this.unsubThreadEvent.emit();
    this.emojiMartVisible = false;
  }

  /**
   * add name to text are when click on @ symbol and the name
   * 
   * @param channelMember {string} - name of the channel member
   */
  addNameToTextArea(channelMember: string) {
    const channelMemberName = ` ${channelMember} `;
    if (!this.copiedText.includes(channelMemberName)) {
      this.copiedText += channelMemberName;
    }
    this.showPersonPopup = false;
  }


  async sendThreadMessage() {
    if ((this.copiedText.trim().length > 0) || this.fileUploadedThread) {
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

      // Format the date as "26.Dezember.2023"
      const day = date.getDate();
      const month = date.toLocaleString('de-DE', { month: 'long' });
      const year = date.getFullYear();
      const formattedDate = `${day}.${month}.${year}`
      this.threadMessage.calculatedTime = formattedTime;
      this.threadMessage.timeStamp = date;
      this.threadMessage.text = this.copiedText;
      this.threadMessage.reactions = [];
      this.threadMessage.reactionsCount = {};

      const threadRef = await addDoc(collection(this.firestore, this.sharedService.threadPath),
        this.threadMessage.toJSON()
      );
      await updateDoc(doc(this.firestore, this.sharedService.threadPath, threadRef.id), {
        id: threadRef.id,
      }).then(async () => {
        let msgId = this.sharedService.messagePath.slice(-20) ;
        let msgPath = this.sharedService.messagePath.slice(0, -20) ;
        await updateDoc(doc(this.firestore, msgPath, msgId), {
          lastThreadTime : formattedTime ,
        })
      });
      this.copiedText = '';
    }
    this.isSendingMessage = false;
    this.scrollToBottom();
    this.resetUploadThread();
    await this.updateNumberOfThreadMsgs();
  }

  async updateNumberOfThreadMsgs() {
    const msgRef = doc(this.firestore, this.sharedService.messagePath);
    await updateDoc(msgRef, {
      numberOfThreadMsgs: increment(1)
    });
  }

  /**
  * check if textare has empty lines
  * 
  */
  isWhitespace(line: string): any {
    if (line.trim() == '') {
      return true;
    } else {
      return false;
    }
  }

}
