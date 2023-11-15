import { Component, ElementRef, EventEmitter, HostListener, Input, AfterViewInit, Output, OnInit, ViewChild, AfterViewChecked, Renderer2, OnChanges, SimpleChanges, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GroupInfoPopupComponent } from '../group-info-popup/group-info-popup.component';
import { GroupMemberComponent } from '../group-member/group-member.component';
import { GroupAddMemberComponent } from '../group-add-member/group-add-member.component';
import { SharedService } from '../services/shared.service';
import { Firestore, addDoc, collection, doc, getDocs, onSnapshot, query, updateDoc, where, getDoc } from '@angular/fire/firestore';
import { ChannelInfo } from '../models/channel-info.class';
import { Message } from '../models/message.class';
import { UserDataService } from '../services/user-data.service';
import { Unsubscribe } from '@angular/fire/auth';


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
  emojiCountMap: { [emoji: string]: number } = {}; // Map to store emoji counts
  showScrollButton = false;
  isSendingMessage = false;
  runtime = false;
  selectedMessageId: string | null = null;
  @ViewChild('scrollButton') scrollButton: ElementRef;
  @ViewChild('chatWrapper') private chatWrapper: ElementRef;
  @Input() threadToogleFromOutside: boolean;
  @Output() threadClosed = new EventEmitter<void>();

  constructor(
    public dialog: MatDialog,
    @Optional() public dialogRef: MatDialogRef<GroupMemberComponent>,
    public sharedService: SharedService,
    public userDataService: UserDataService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private firestore: Firestore) {
    this.sharedService.isSidebarOpen$().subscribe((isOpen) => {
      this.isSidebarOpen = isOpen;
    });

  }

  ngOnInit() {
    this.sharedService.currentActiveChannel$.subscribe(async (value) => {
      this.sharedService.templateIsReady = false;
      // console.log('Änderungen :', value);
      // await this.getChannelsFromDataBase(value);
      await this.sharedService.getChannelsFromDataBase(value);
      // await this.createSubscribeChannelMessages();
      this.sharedService.createSubscribeChannelMessages();
      // await this.getUsersFromChannel();
      console.log(this.sharedService.filteredChannels);

    });
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

  // Function to toggle the visibility of the emoji-mart for a specific message
  toggleEmojiForMessage(messageID?: string) {
    if (this.selectedMessageId === messageID) {
      this.selectedMessageId = null; // Close the emoji-mart if it's already open for this message
    } else {
      this.selectedMessageId = messageID; // Open the emoji-mart for the selected message
    }
    this.emojiMartVisible = !this.emojiMartVisible;
    console.log('Updated selected message ID:', this.selectedMessageId);
  }

  addReactionToMessage(emoji: string) {
    console.log(emoji['emoji']['native']);
    this.selectedEmoji = emoji['emoji']['native'];
    if (this.selectedEmoji) {
      this.emojiCountMap[this.selectedEmoji] = (this.emojiCountMap[this.selectedEmoji] || 0) + 1;
    }
    this.emojiMartVisible = false;
  }

  /**
   * add name to text are when click on @ symbol and the name
   * 
   * @param channelMember {string} - name of the channel member
   */
  addNameToTextArea(channelMember: string) {
    this.copiedText += `@${channelMember} `;
    this.showPersonPopup = false;
  }

  /**
   * open Group Info dialog
   * 
   */
  openGroupInfoPopUp(): void {
    this.dialog.open(GroupInfoPopupComponent, { position: { top: '180px', left: '320px' }, panelClass: 'custom-channel-dialog', data: this.sharedService.filteredChannels });
  }

  openGroupMemberPopUp() {
    this.dialog.open(GroupMemberComponent, { position: { top: '180px', right: '50px' }, panelClass: 'custom-channel-dialog', data: this.sharedService.filteredChannels });

  }

  /**
   * open Add Member dialog
   * 
   */
  openAddMemberPopUp(): void {
    this.dialog.open(GroupAddMemberComponent, { position: { top: '180px', right: '50px' }, panelClass: 'custom-logout-dialog', data: this.sharedService.filteredChannels });
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

  /**
   * open person dialog in chat
   * 
   */
  togglePersonPopup(): void {
    this.showPersonPopup = !this.showPersonPopup;
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

    if (!this.threadOpen && this.lastMessageId == '') {
      this.openThread(messageID);
      this.lastMessageId = messageID;
      this.threadRuntime = true;
    } else if ((this.lastMessageId == messageID) && this.threadOpen){
      this.closeThread();
    } else if ((this.lastMessageId != messageID) && this.threadOpen){
      this.sharedService.currentThreadContent = [] ;
      this.createSubscribeThreadMessages(messageID) ;
      this.lastMessageId = messageID ;
    }

    console.log('Last Msg ID : ' ,this.lastMessageId);

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
    this.unsubThread();
    this.threadClosed.emit();
    this.threadOpen = false;
    this.lastMessageId = '';
    this.sharedService.currentThreadContent = [] ;
  }

  /**
   * create a subscribe for changes in thread messages
   * 
   * @param messageID {string} - id form the clicked message
   */
  async createSubscribeThreadMessages(messageID: string) {
    let channelId = this.sharedService.filteredChannels[1];
    // console.log('Aktuelle Message ID : ', messageID);
    //load right thread from firestore
    this.unsubThread = onSnapshot(collection(this.firestore, `channels/${channelId}/messages/${messageID}/thread`), async (doc) => {
      console.log('Thread with id :', messageID, 'updating');
      await this.getThreadMessagesFromSingleMessage(messageID);
    });
  }

  /**
   * send a normal messgae in a channel
   * create subcollection messages in channel doc
   * create subcollection thread in subcollection messages with the first content of the message
   * 
   */
  async messageSend() {
    if (this.copiedText.length >= 1) {
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
      this.message.calculatedTime = formattedTime;
      this.message.time = date;
      this.message.text = this.copiedText;
      this.copiedText = '';
      //add subcollection
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
      // console.log(messageRef.id);
      const threadSubcollection = await addDoc(collection(messageRef, `thread`),
        this.message.toJSON()
      );
      this.isSendingMessage = false;
      this.scrollToBottom();
      this.sharedService.createSubscribeChannelMessages();
    }
  }

  /**
   * get the thread messages from a single message
   * push to thradMessagesFromDB with the class Message
   * 
   * @param messageID {string} - id form the clicked message
   */
  async getThreadMessagesFromSingleMessage(messageID: string) {
    this.sharedService.threadContentReady = false ;
    let channelId = this.sharedService.filteredChannels[1];
    this.sharedService.currentThreadContent = [];
    const querySnapshotThread = await getDocs(collection(this.firestore, `channels/${channelId}/messages/${messageID}/thread`));
    querySnapshotThread.forEach((doc) => {
      this.sharedService.currentThreadContent.push(new Message(doc.data()));
      // console.log('Thread Data:', doc.data());
      //console.log(this.sharedService.currentThreadContent.length);
    });
    //set path in sharedService
    this.sharedService.threadPath = '';
    this.sharedService.threadPath = `channels/${channelId}/messages/${messageID}/thread`;
    this.sortMessagesTime(this.sharedService.currentThreadContent);
    console.log('Thread Cotent', this.sharedService.currentThreadContent);
    this.sharedService.threadContentReady = true ;
  }

  /**
   * sort the messages by time
   * 
   */
  sortMessagesTime(array) {
    array.sort((a, b) => a.time - b.time);
  }
}
