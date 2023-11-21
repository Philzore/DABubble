import { Component } from '@angular/core';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-direct-chat',
  templateUrl: './direct-chat.component.html',
  styleUrls: ['./direct-chat.component.scss']
})
export class DirectChatComponent {
  emojiMap: { [messageId: string]: string[] } = {};
  emojiCountMap: { [emoji: string]: number } = {};
  selectedMessageId: string | null = null;
  emojiMartVisible = false;

  constructor(
    public sharedService: SharedService,
    ) {

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
    console.log(emoji);
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
}
