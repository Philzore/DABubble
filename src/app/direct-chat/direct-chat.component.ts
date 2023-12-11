import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { UserDataService } from '../services/user-data.service';
import { Firestore, addDoc, arrayUnion, collection, doc, getDoc, runTransaction, updateDoc } from '@angular/fire/firestore';
import { Message } from '../models/message.class';
import { debounceTime } from 'rxjs';

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
  directMessage = new Message();

  constructor(
    public sharedService: SharedService,
    public userDataService: UserDataService,
    private firestore: Firestore,
  ) {

  }

  ngOnInit(): void {


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

  /**
   * open add Data dialog in chat
   * 
   */
  toggleAddDataPopup(): void {
    this.showAddDataPopup = !this.showAddDataPopup;
  }

  /**
   * open emoji dialog in chat
   * 
   */
  toggleEmojiPopup(): void {
    this.showEmojiPopup = !this.showEmojiPopup;
  }

  addEmoji(emoji: string) {
    this.copiedTextDirectMsg += emoji['emoji']['native'];
    this.showEmojiPopup = false;
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
  
  
  addCheckMarkAsReaction(emoji: { native: string }, messageId: string) {
    const existingEmojis = this.emojiMap[messageId] || [];
    const emojiNative = emoji.native;

    if (existingEmojis.includes(emojiNative)) {
      this.emojiCountMap[emojiNative] = (this.emojiCountMap[emojiNative] || 0) + 1;
    } else {
      this.emojiMap[messageId] = [...existingEmojis, emojiNative];
      this.emojiCountMap[emojiNative] = 1;
    }
  }

  addRaisedHandsAsReaction(emoji: { native: string }, messageId: string) {
    const existingEmojis = this.emojiMap[messageId] || [];
    const emojiNative = emoji.native;

    if (existingEmojis.includes(emojiNative)) {
      this.emojiCountMap[emojiNative] = (this.emojiCountMap[emojiNative] || 0) + 1;
    } else {
      this.emojiMap[messageId] = [...existingEmojis, emojiNative];
      this.emojiCountMap[emojiNative] = 1;
    }
  }

  // Function to open emoji-mart for a specific message
  openEmojiForMessage(messageID?: string) {
    if (this.selectedMessageId === messageID) {
      this.emojiMartVisible = false;
    } else {
      this.selectedMessageId = messageID; // Open the emoji-mart for the selected message
    }
    this.emojiMartVisible = true;
  }


  /**
   * 
   * 
   */
  async sendDirectMsg() {

    if (this.copiedTextDirectMsg.length >= 1) {
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
      this.directMessage.calculatedTime = formattedTime;
      this.directMessage.time = date;
      this.directMessage.text = this.copiedTextDirectMsg;
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
      // this.scrollToBottom();
      // this.sharedService.createSubscribeChannelMessages();
    }
  }
}

