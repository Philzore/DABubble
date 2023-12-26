import { Component, ElementRef, EventEmitter, HostListener, Input, AfterViewInit, Output, OnInit, ViewChild, AfterViewChecked, Renderer2, OnChanges, SimpleChanges, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GroupInfoPopupComponent } from '../group-info-popup/group-info-popup.component';
import { GroupMemberComponent } from '../group-member/group-member.component';
import { GroupAddMemberComponent } from '../group-add-member/group-add-member.component';
import { SharedService } from '../services/shared.service';
import { Firestore, addDoc, collection, doc, getDocs, onSnapshot, query, updateDoc, where, getDoc, runTransaction } from '@angular/fire/firestore';
import { ChannelInfo } from '../models/channel-info.class';
import { Message } from '../models/message.class';
import { UserDataService } from '../services/user-data.service';
import { Unsubscribe } from '@angular/fire/auth';
import { ExpressionBinding } from '@angular/compiler';
import { AppComponent } from '../app.component';
import { FormControl } from '@angular/forms';
import { Observable, finalize, map, startWith } from 'rxjs';
import { User } from '../models/user.class';
import { NgZone } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { provideStorage, getStorage, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage'

@Component({
  selector: 'app-main-chat',
  templateUrl: './main-chat.component.html',
  styleUrls: ['./main-chat.component.scss']
})
export class MainChatComponent implements OnInit, OnChanges {

  copiedText: string = '';
  isSidebarOpen: boolean = true;
  showAddDataPopup: boolean = false;
  showEmojiPopup: boolean = false;
  showPersonPopup: boolean = false;
  channelsFromDataBase = [];
  usersFromDatabase = [];
  usersFromChannels = [];
  userData = [];
  thradMessagesFromDB = [];
  threadRuntime: boolean = false;
  lastMessageId: string = '';
  message = new Message();
  threadMessage = new Message();
  threadOpen = false;
  unsubThread;
  emojiMartVisible = false;
  selectedEmoji: string | null = null;
  showScrollButton = false;
  isSendingMessage = false;
  runtime = false;
  groupInfoPopUpOpen: boolean = false; 
  groupMemberPopUpOpen: boolean = false;
  isScreenWidthGreaterThan1200 = window.innerWidth > 1200;
  isSmallScreen: boolean;
  uploadedFiles: Array<{ name: string, url: string }> = [];
  emojiMap: { [messageId: string]: string[] } = {};
  emojiCountMap: { [emoji: string]: number } = {};
  selectedMessageId: string | null = null;
  @ViewChild('scrollButton') scrollButton: ElementRef;
  @ViewChild('chatWrapper') private chatWrapper: ElementRef;
  @ViewChild('messageContainer') private messageContainer: ElementRef;
  @ViewChild('emojiMartElement') private emojiMartElement: ElementRef;
  @ViewChild('toggleEmojiButton') private toggleEmojiButton: ElementRef;
  @Input() threadToogleFromOutside: boolean;
  @Output() threadClosed = new EventEmitter<void>();
  filePreview: string | ArrayBuffer | null = null;
  storage = getStorage();

  constructor(
    public dialog: MatDialog,
    @Optional() public dialogRef: MatDialogRef<GroupMemberComponent>,
    public sharedService: SharedService,
    public userDataService: UserDataService,
    private elementRef: ElementRef,
    private eRef: ElementRef,
    private breakpointObserver: BreakpointObserver,
    private renderer: Renderer2,
    private GroupInfoDialogRef: MatDialogRef<GroupInfoPopupComponent>,
    private firestore: Firestore,
    private ngZone: NgZone,
    private router: Router,
    public appComponent: AppComponent,
    ) {
    this.sharedService.isSidebarOpen$().subscribe((isOpen) => {
      this.isSidebarOpen = isOpen;
    });
  }

  async ngOnInit() {
    await this.sharedService.getChannelsFromDataBase('first');
    this.sharedService.createSubscribeChannelMessages();
  }

  /**
   * check if enter key is pressed , if yes, send message
   * 
   * @param event 
   */
  onKeydown(event) {
    if ((event.key === "Enter") && (this.copiedText.length >= 1) && !this.isWhitespace(this.copiedText)) {
      //to avoid the default action what would be the line break
      event.preventDefault();
      this.messageSend();
    }
  }

  closeEmojiPopUp():void {
    this.emojiMartVisible = false;
  }

  insideClick(event: Event) {
    event.stopPropagation(); // Prevent click from reaching the document
  }

  /**
   * if @input is changing trigger this function
   * 
   * @param changes - react on bool changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['threadToogleFromOutside'] && this.runtime) {
      this.closeThread();
    }
    this.runtime = true;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.isScreenWidthGreaterThan1200 = window.innerWidth > 1200;
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

  addEmoji(emoji: string) {
    this.copiedText += emoji['emoji']['native'];
    this.showEmojiPopup = false;
  }

  // Function to open emoji-mart for a specific message
  openEmojiForMessage(messageID?: string) {
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
  
  
  /**
   * add name to text are when click on @ symbol and the name
   * 
   * @param channelMember {string} - name of the channel member
   */
  addNameToTextArea(channelMember: string) {
    const channelMemberName = `@ ${channelMember} `;
    if (!this.copiedText.includes(channelMemberName)) {
      this.copiedText += channelMemberName;
    }
    this.showPersonPopup = false;
  }

  /**
 * open Group Info dialog
 * 
 */
openGroupInfoPopUp(): void {
  // Determine if the screen width is greater than 1200px
  const isScreenWidthGreaterThan1200 = window.innerWidth > 1200;

  // Configure the dialog settings based on screen width
  const dialogConfig = {
    position: isScreenWidthGreaterThan1200 ? { top: '180px', left: '320px' } : {},
    panelClass: isScreenWidthGreaterThan1200 ? 'group-info-dialog' : 'br-30',
    data: this.sharedService.filteredChannels
  };

  // Open the dialog with the configured settings
  const dialogRef = this.dialog.open(GroupInfoPopupComponent, dialogConfig);

  dialogRef.afterClosed().subscribe((result) => {
    if (result && result.event === 'start') {
      this.appComponent.showFeedback('Du hast den Channel Verlassen');
    }
  });
}


  openGroupMemberPopUp() {
    // Determine if the screen width is greater than 1200px
    const isScreenWidthGreaterThan1200 = window.innerWidth > 1200;
  
    // Configure the dialog settings based on screen width
    const dialogConfig = {
      position: isScreenWidthGreaterThan1200 ? { top: '180px', right: '150px' } : {},
      panelClass: isScreenWidthGreaterThan1200 ? 'custom-logout-dialog' : 'br-30',
      data: this.sharedService.filteredChannels
    };
  
    // Open the dialog with the configured settings
    this.dialogRef = this.dialog.open(GroupMemberComponent, dialogConfig);
  }


  /**
   * open Add Member dialog
   * 
   */
  openAddMemberPopUp(): void {
    const isScreenWidthGreaterThan1200 = window.innerWidth > 1200;
  
    const dialogConfig = {
      data: this.sharedService.filteredChannels,
      position: isScreenWidthGreaterThan1200 ? { top: '180px', right: '70px' } : {},
      ...(isScreenWidthGreaterThan1200 ? { panelClass: 'custom-logout-dialog' } : {})
    };
  
    const dialogRef = this.dialog.open(GroupAddMemberComponent, dialogConfig);
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.event === 'start') {
        this.appComponent.showFeedback('Die Nutzer wurden dem Channel hinzugefügt');
      }
    });
  }
  

  /**
   * open add Data dialog in chat
   * 
   */
  toggleAddDataPopup(): void {
    this.showAddDataPopup = !this.showAddDataPopup;
    this.showEmojiPopup = false;
    this.showPersonPopup = false;
  }

  /**
   * open emoji dialog in chat
   * 
   */
  toggleEmojiPopup(): void {
    this.showEmojiPopup = !this.showEmojiPopup;
    this.showAddDataPopup = false;
    this.showPersonPopup = false;
  }

  /**
   * open person dialog in chat
   * 
   */
  togglePersonPopup(): void {
    this.showPersonPopup = !this.showPersonPopup;
    this.showAddDataPopup = false;
    this.showEmojiPopup = false;
  }


  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showAddDataPopup = false;
      this.showEmojiPopup = false;
      this.showPersonPopup = false;
    }
  }

  /**
   * close pop ups with escape key
   * 
   * @param event {listener}
   */
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    this.closePopups();
  }

  /**
   * close pop ups
   * 
   */
  closePopups(): void {
    this.showAddDataPopup = false;
    this.showEmojiPopup = false;
    this.showPersonPopup = false;
  }

  /**
   * open or close the thrad component
   * 
   * @param messageID {string} - id form the clicked message
   */
  toggleThread(messageID: string) {
    this.sharedService.threadContentReady = false;
    if (!this.threadOpen && this.lastMessageId == '') {
      this.openThread(messageID);
      this.lastMessageId = messageID;
      this.threadRuntime = true;
    } else if ((this.lastMessageId == messageID) && this.threadOpen) {
      this.closeThread();
    } else if ((this.lastMessageId != messageID) && this.threadOpen) {
      this.unsubThread();
      this.sharedService.currentThreadContent = [];
      this.lastMessageId = messageID;
      this.createSubscribeThreadMessages(messageID);
    }
    // ? only for mobilephone or also on larger devices ? 
    this.emojiMartVisible = false;
  }

  /**
   * open thread component
   * 
   * @param messageID {string} - id form the clicked message
   */
  openThread(messageID: string) {
    this.threadClosed.emit();
    this.createSubscribeThreadMessages(messageID);
    this.threadOpen = true;
  }

  /**
   * close thread component
   * 
   */
  closeThread() {
    if (this.unsubThread) {
      this.unsubThread();
    }
    this.threadClosed.emit();
    this.threadOpen = false;
    this.lastMessageId = '';
    this.sharedService.currentThreadContent = [];
    this.sharedService.threadContentReady = false;
  }

  /**
   * create a subscribe for changes in thread messages
   * 
   * @param messageID {string} - id form the clicked message
   */
  async createSubscribeThreadMessages(messageID: string) {
    let channelId = this.sharedService.filteredChannels[1];
    //load right thread from firestore
    this.unsubThread = onSnapshot(collection(this.firestore, `channels/${channelId}/messages/${messageID}/thread`), async (doc) => {
      await this.getThreadMessagesFromSingleMessage(messageID);
    });
  }


  //TODO shorten the messageSend function
  /**
   * send a normal messgae in a channel
   * create subcollection messages in channel doc
   * create subcollection thread in subcollection messages with the first content of the message
   * 
   */
  async messageSend() {
    if (this.copiedText.length >= 1 && !this.isWhitespace(this.copiedText)) {
      this.sharedService.unsubChannels();
      this.isSendingMessage = true;
      this.message.from = this.userDataService.currentUser['name'];
      if (this.message.from == 'Gast') {
        this.message.profileImg = `./assets/characters/default_character.png`;
      } else {
        this.message.profileImg = `${this.userDataService.currentUser['imgNr']}`;
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
      this.message.calculatedTime = formattedTime;
      this.message.time = formattedDate;
      this.message.text = this.copiedText;
      this.message.reactionsCount = {};
      this.message.reactions = [];
      this.message.numberOfThreadMsgs = 0;
      this.copiedText = '';

      //add subcollection firestore logic
      let channelId = this.sharedService.filteredChannels[1];
      const singleRef = doc(this.firestore, 'channels', channelId);
      const subcollectionMessages = await addDoc(collection(singleRef, 'messages'),
        this.message.toJSON()
      );
      await updateDoc(doc(this.firestore, `channels/${channelId}/messages`, subcollectionMessages.id), {
        id: subcollectionMessages.id,
      });
      //create thread subcollection
      const messageRef = doc(this.firestore, `channels/${channelId}/messages`, subcollectionMessages.id);
      const threadSubcollection = await addDoc(collection(messageRef, `thread`),
        this.message.toJSON()
      );
      this.isSendingMessage = false;
      this.sharedService.createSubscribeChannelMessages();
      setTimeout(() => {
        this.scrollToBottom();
      }, 100);
    }
    this.scrollToBottom() ;
  }

  isSameDay(messageDate) {
    const currentDate = new Date();
    const msgDate = new Date(messageDate);
  
    return currentDate.getDate() === msgDate.getDate() &&
           currentDate.getMonth() === msgDate.getMonth() &&
           currentDate.getFullYear() === msgDate.getFullYear();
  }

  onFileSelected(event) {
    const file = event.target.files[0];
    if (file) {
      this.uploadFile(file);
    }
  }

  uploadFile(file) {
    const storageRef = ref(this.storage, 'uploads/' + file.name);
    uploadBytes(storageRef, file).then((snapshot) => {
      console.log('Uploaded a file!');
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        this.uploadedFiles.push({ name: file.name, url: downloadURL });
      });
    });
    console.log(storageRef);
  }

  async addReactionToMessage(emoji: string, messageId: string) {
    try {
      let channelId = this.sharedService.filteredChannels[1];
      const singleRef = doc(this.firestore, 'channels', channelId);
      const messageRef = doc(singleRef, 'messages', messageId);
  
      // Use transaction to handle concurrency issues
      await runTransaction(this.firestore, async (transaction) => {
        // Retrieve existing reactions from Firebase
        const messageSnapshot = await transaction.get(messageRef);
        const existingReactions = messageSnapshot.data()?.['reactions'] || [];
        const exisitingsReactionsCount = messageSnapshot.data()?.['reactionsCount'] || {};
  
        // Your existing logic for updating local emoji map and count
        if (this.selectedMessageId === messageId) {
          const emojiNative = emoji['emoji']['native'];
          if (existingReactions.includes(emojiNative)) {
            exisitingsReactionsCount[emojiNative] = (exisitingsReactionsCount[emojiNative] || 0) + 1;
          } else {
            this.emojiMap[messageId] = [...existingReactions, emojiNative];
            exisitingsReactionsCount[emojiNative] = 1;
          }
          (this.message.reactions as string[]) = this.emojiMap[messageId];
        }
  
        // Ensure this.emojiMap[messageId] is defined before updating Firestore
        if (this.emojiMap[messageId] !== undefined) {
          transaction.update(messageRef, {
            reactions: this.emojiMap[messageId],
            reactionsCount: exisitingsReactionsCount,
          });
        } else {
          console.error(`this.emojiMap[${messageId}] is undefined`);
        }
      });
  
      this.emojiMartVisible = false;
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
    
  }
  

  async addReaction(emoji, messageId) {
    try {
      let channelId = this.sharedService.filteredChannels[1];
      const singleRef = doc(this.firestore, 'channels', channelId);
      const messageRef = doc(singleRef, 'messages', messageId);

      await runTransaction(this.firestore, async (transaction) => {
        const emojiNative = emoji.native;
        const messageSnapshot = await transaction.get(messageRef);
        const existingReactions = messageSnapshot.data()?.['reactions'] || [];
        const existingReactionsCount = messageSnapshot.data()?.['reactionsCount'] || {};

        // Initialize emojiMap for messageId if it doesn't exist
        if (!this.emojiMap[messageId]) {
          this.emojiMap[messageId] = existingReactions;
        }

        if (existingReactions.includes(emojiNative)) {
          existingReactionsCount[emojiNative] = (existingReactionsCount[emojiNative] || 0) + 1;
        } else {
          this.emojiMap[messageId] = [...this.emojiMap[messageId], emojiNative];
          existingReactionsCount[emojiNative] = 1;
        }

        // Update the local message reactions
        (this.message.reactions as string[]) = this.emojiMap[messageId];


        // Ensure this.emojiMap[messageId] is defined before updating Firestore
        if (this.emojiMap[messageId] !== undefined) {
          transaction.update(messageRef, {
            reactions: this.emojiMap[messageId],
            reactionsCount: existingReactionsCount,
          });
        } 
      });
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  }
  




  /**
   * get the thread messages from a single message
   * push to thradMessagesFromDB with the class Message
   * 
   * @param messageID {string} - id form the clicked message
   */
  async getThreadMessagesFromSingleMessage(messageID: string) {
    this.sharedService.threadContentReady = false;
    let channelId = this.sharedService.filteredChannels[1];
    this.sharedService.currentThreadContent = [];
    const querySnapshotThread = await getDocs(collection(this.firestore, `channels/${channelId}/messages/${messageID}/thread`));
    querySnapshotThread.forEach((doc) => {
      this.sharedService.currentThreadContent.push(new Message(doc.data()));
    });
    //set path in sharedService
    this.sharedService.messagePath = '';
    this.sharedService.threadPath = '';
    this.sharedService.messagePath = `channels/${channelId}/messages/${messageID}`;
    this.sharedService.threadPath = `channels/${channelId}/messages/${messageID}/thread`;
    this.sortMessagesTime(this.sharedService.currentThreadContent);
    this.sharedService.threadContentReady = true;
  }

  /**
   * sort the messages by time
   * 
   */
  sortMessagesTime(array) {
    array.sort((a, b) => a.time - b.time);
  }

  /**
   * check if textare has empty lines
   * 
   */
 isWhitespace(line: string): any {
    if (line.trim() == '') {
      return true ;
    } else {
      return false ;
    }
  }
}
