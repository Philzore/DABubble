import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { UserDataService } from '../services/user-data.service';
import { Firestore, arrayUnion, doc, getDoc, runTransaction, updateDoc } from '@angular/fire/firestore';
import { Message } from '../models/message.class';
import { getStorage, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage'

@Component({
  selector: 'app-direct-chat',
  templateUrl: './direct-chat.component.html',
  styleUrls: ['./direct-chat.component.scss']
})
export class DirectChatComponent implements OnInit {
  copiedTextDirectMsg: string = '';
  emojiMap: { [messageId: string]: string[] } = {};
  emojiCountMap: { [emoji: string]: number } = {};
  selectedMessageId: string | null = null;
  emojiMartVisible = false;
  showAddDataPopup: boolean = false;
  showEmojiPopup: boolean = false;
  isSendingMessage = false;
  showScrollButton = false;
  filePreview: string | ArrayBuffer | null = null;
  lastDisplayedDate: string | null = null;
  fileUploadedDirect:boolean = false;
  directMessage = new Message();
  @ViewChild('chatWrapper') private chatWrapper: ElementRef;


  constructor(
    public sharedService: SharedService,
    public userDataService: UserDataService,
    private firestore: Firestore,
  ) {

  }

  scrollToBottom() {
    const container: HTMLElement = this.chatWrapper.nativeElement;
    container.scrollTop = container.scrollHeight;
  }

  ngOnInit(): void {  }

  uploadImagesDirect(event: any) {
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
          this.directMessage.imageUrl = url;
          this.directMessage.fileUploaded = true;
          this.fileUploadedDirect = true; // Set to true when a file is successfully uploaded
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

  resetUpload() {
    this.directMessage.fileUploaded = false;
    this.fileUploadedDirect = false;
    this.copiedTextDirectMsg = '';
  }

  /**
   * check if enter key is pressed , if yes, send message
   * 
   * @param event 
   */
  onKeydown(event) {
    if (event.key === "Enter") {
      this.sendDirectMsg();
    }
  }

  addEmoji(emoji: string) {
    this.copiedTextDirectMsg += emoji['emoji']['native'];
    this.showEmojiPopup = false;
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

  async addReactionToMessage(emoji: string, messageId: string) {
    const singleRef = doc(this.firestore, 'directMessages', this.sharedService.currentDirectMsgID);
    const messageRefSnap = await getDoc(singleRef);
    let allMessages = messageRefSnap.data()['messages'];
  
    await runTransaction(this.firestore, async (transaction) => {
      const messageSnapshot = await transaction.get(singleRef);
      const existingReactions = messageSnapshot.data()?.['reactions'] || [];
      const existingReactionsCount = messageSnapshot.data()?.['reactionsCount'] || {};
  
      if (this.selectedMessageId === messageId) {
        const emojiNative = emoji['emoji']['native'];
        if (existingReactions.includes(emojiNative)) {
          existingReactionsCount[emojiNative] = (existingReactionsCount[emojiNative] || 0) + 1;
        } else {
          // Update the specific message's reactions and counts
          if (!allMessages[messageId].reactions) {
            allMessages[messageId].reactions = [];
          }
          if (!allMessages[messageId].reactionsCount) {
            allMessages[messageId].reactionsCount = {};
          }
          allMessages[messageId].reactions.push(emojiNative);
          allMessages[messageId].reactionsCount[emojiNative] = 1;
        }
      }
      // Update the entire messages array in the transaction
      transaction.update(singleRef, {
        messages: allMessages,
      });
    });
    this.emojiMartVisible = false;
  }
  
  
  async addReaction(emoji: { native: string }, messageId: string) {
    const singleRef = doc(this.firestore, 'directMessages', this.sharedService.currentDirectMsgID);
    const messageRefSnap = await getDoc(singleRef);
    const allMessages = messageRefSnap.data()?.['messages'] || {};
  
    const emojiNative = emoji.native;
  
    if (allMessages[messageId]) {
      // Update the specific message's reactions and counts
      allMessages[messageId].reactions = allMessages[messageId].reactions || [];
      allMessages[messageId].reactionsCount = allMessages[messageId].reactionsCount || {};
  
      if (allMessages[messageId].reactions.includes(emojiNative)) {
        allMessages[messageId].reactionsCount[emojiNative] = (allMessages[messageId].reactionsCount[emojiNative] || 0) + 1;
      } else {
        allMessages[messageId].reactions.push(emojiNative);
        allMessages[messageId].reactionsCount[emojiNative] = 1;
      }
      // Update the entire messages array
      await updateDoc(singleRef, {
        messages: allMessages,
      });
    }
    this.emojiMartVisible = false;
  }
  

  // Function to open emoji-mart for a specific message
  openEmojiForMessage(messageID?: string) {
    this.insideClick(event);

    // Check if the emoji picker is already open for this message
    if (this.selectedMessageId === messageID) {
      // Toggle the visibility of the emoji picker
      this.emojiMartVisible = !this.emojiMartVisible;
    } else {
      // Open the emoji picker for the new message and ensure it's visible
      this.selectedMessageId = messageID;
      this.emojiMartVisible = true;
    }

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
    }
  
    /**
     * open emoji dialog in chat
     * 
     */
    toggleEmojiPopup(): void {
      this.insideClick(event) ;
      this.showEmojiPopup = !this.showEmojiPopup;
      this.showAddDataPopup = false;
    }
  
    closePopUps() {
      this.emojiMartVisible = false;
      this.showAddDataPopup = false;
      this.showEmojiPopup = false;
    }
  
    /**
     * close pop ups with escape key
     * 
     * @param event {listener}
     */
    @HostListener('document:keydown.escape', ['$event'])
    onEscapeKey(event: KeyboardEvent): void {
      this.closePopUps();
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
  

  /**
   * 
   * 
   */
  async sendDirectMsg() {
    if (this.copiedTextDirectMsg.trim().length > 0 || this.fileUploadedDirect) {
      // this.sharedService.unsubChannels();
      this.isSendingMessage = true;
      this.directMessage.from = this.userDataService.currentUser['name'];
      if (this.directMessage.from == 'Gast') {
        this.directMessage.profileImg = `./assets/characters/default_character.png`;
      } else {
        this.directMessage.profileImg = `${this.userDataService.currentUser['imgNr']}`;
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
      this.directMessage.calculatedTime = formattedTime;
      this.directMessage.text = this.copiedTextDirectMsg;
      this.directMessage.timeStamp = date;
      this.directMessage.id = String(this.sharedService.directMsgsFromDB.length) ;
      // this.directMessage.reactionsCount = {};
      // this.directMessage.reactions = [];
      this.copiedTextDirectMsg = '';

      //add subcollection firestore logic
      let directMsgID = this.sharedService.currentDirectMsgID;

      await updateDoc(doc(this.firestore, `directMessages`, directMsgID), {
        messages: arrayUnion(this.directMessage.toJSON()),
      });
      this.isSendingMessage = false;
      setTimeout(() => {
        this.scrollToBottom();
      }, 100);
    }
    this.scrollToBottom();
    this.resetUpload();
    }
}
