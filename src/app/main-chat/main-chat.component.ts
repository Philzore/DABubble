import { Component, ElementRef, EventEmitter, HostListener, Input, AfterViewInit, Output, OnInit, ViewChild, AfterViewChecked, Renderer2, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GroupInfoPopupComponent } from '../group-info-popup/group-info-popup.component';
import { GroupMemberComponent } from '../group-member/group-member.component';
import { GroupAddMemberComponent } from '../group-add-member/group-add-member.component';
import { SharedService } from '../services/shared.service';
import { Firestore, addDoc, collection, doc, getDocs, onSnapshot, query, updateDoc, where, getDoc } from '@angular/fire/firestore';
import { ChannelInfo } from '../models/channel-info.class';
import { Message } from '../models/message.class';
import { UserDataService } from '../services/user-data.service';


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
  filteredChannels = [];
  channelMessagesFromDB = [];
  thradMessagesFromDB = [];
  templateIsReady = false;
  message = new Message();
  threadMessage = new Message();
  threadOpen = false;
  unsubThread;
  showScrollButton = false;
  isSendingMessage = false;

  runtime = false;

  @ViewChild('scrollButton') scrollButton: ElementRef;
  @ViewChild('chatWrapper') private chatWrapper: ElementRef;

  @Input() threadToogleFromOutside: boolean;
  @Output() threadClosed = new EventEmitter<void>();

  constructor(
    public dialog: MatDialog,
    public sharedService: SharedService,
    public userDataService: UserDataService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private firestore: Firestore) {
    this.sharedService.isSidebarOpen$().subscribe((isOpen) => {
      this.isSidebarOpen = isOpen;
    });
    // this.openGroupInfoPopUp();
  }

  ngOnInit() {
    this.sharedService.currentActiveChannel$.subscribe(async (value) => {
      this.templateIsReady = false;
      console.log('Änderungen :', value);
      await this.getChannelsFromDataBase(value);
      await this.createSubscribeChannelMessages();
      await this.getUsersFromChannel();
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['threadToogleFromOutside'] && this.runtime) {
      console.log('Change');
      this.toggleThread();
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

  /**
   * open Group Info dialog
   * 
   */
  openGroupInfoPopUp(): void {
    this.dialog.open(GroupInfoPopupComponent, { position: { top: '180px', left: '320px' }, panelClass: 'custom-channel-dialog', data: this.filteredChannels });
  }

  /**
   * open Group Member dialog
   * 
   */
  openGroupMemberPopUp(): void {
    this.dialog.open(GroupMemberComponent, { position: { top: '180px', right: '150px' }, panelClass: 'custom-logout-dialog', data: this.filteredChannels });
  }

  /**
   * open Add Member dialog
   * 
   */
  openAddMemberPopUp(): void {
    this.dialog.open(GroupAddMemberComponent, { position: { top: '180px', right: '50px' }, panelClass: 'custom-logout-dialog' });
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

  // Close popups with the Escape key
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    this.closePopups();
  }

  closePopups(): void {
    this.showAddDataPopup = false;
    this.showEmojiPopup = false;
    this.showPersonPopup = false;
  }


  async getChannelsFromDataBase(name) {
    this.filteredChannels = [];
    const channelRef = collection(this.firestore, 'channels');
    const filteredChannels = query(channelRef, where('name', "==", name))
    const querySnapshot = await getDocs(filteredChannels);
    querySnapshot.forEach((doc) => {
      this.filteredChannels.push(doc.data(), doc.id);
      console.log(this.filteredChannels);
    });
    this.templateIsReady = true;
  }

  /**
   * open or close the thrad component
   * 
   * @param messageID {string} - id form the clicked message
   */
  toggleThread(messageID?: string) {
    console.log('Thrad status Anfang:', this.threadOpen);

    if (this.threadOpen) {
      console.log('Unsub');
      this.unsubThread();
    } else {
      this.createSubscribeThreadMessages(messageID);
    }
    this.threadClosed.emit();
    this.threadOpen = !this.threadOpen;
    console.log('Thrad status Ende:', this.threadOpen);
  }

  unsubThreadMessages() {
    this.unsubThread();
    console.log('Unsub');
  }

  /**
   * create a subscribe for changes in thread messages
   * 
   * @param messageID {string} - id form the clicked message
   */
  async createSubscribeThreadMessages(messageID) {
    let channelId = this.filteredChannels[1];
    // console.log('Aktuelle Message ID : ', messageID);
    //load right thread from firestore
    this.unsubThread = onSnapshot(collection(this.firestore, `channels/${channelId}/messages/${messageID}/thread`), async (doc) => {
      console.log('Thread with id :', messageID, 'updating');
      await this.getThreadMessagesFromSingleMessage(messageID);
    });
  }

  /**
   * create subscribe for changes in messages for a single channel
   * 
   */
  async createSubscribeChannelMessages() {
    let channelId = this.filteredChannels[1];
    const unsubChannels = onSnapshot(collection(this.firestore, `channels/${channelId}/messages`), async (doc) => {
      await this.getMessagesFromChannel();
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
      this.isSendingMessage = true;
      this.message.from = this.userDataService.currentUser['name'];
      if (this.message.from == 'Gast') {
        this.message.profileImg = `./assets/characters/default_character.png`;
      } else {
        this.message.profileImg = `./assets/characters/character_${this.userDataService.currentUser['imgNr']}.png`;
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
      let channelId = this.filteredChannels[1];
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
    }
  }

  // function to get the user from a channel to display when clicking on @ in input field to tag somebody in the group
  async getUsersFromChannel() {
    let channelId = this.filteredChannels[1];
    this.usersFromChannels = [];
    const querySnapshotChannel = await getDocs(collection(this.firestore, `channels/${channelId}`));

    querySnapshotChannel.forEach((doc) => {
      this.usersFromChannels.push(doc.data());
      console.log(this.usersFromChannels);
    })

  }

  /**
   * get the messages from the current active channel
   * then sort it by time
   * 
   */
  async getMessagesFromChannel() {
    let channelId = this.filteredChannels[1];
    this.channelMessagesFromDB = [];
    const querySnapshotMessages = await getDocs(collection(this.firestore, `channels/${channelId}/messages`));
    querySnapshotMessages.forEach((doc) => {
      this.channelMessagesFromDB.push(new Message(doc.data()));
      // console.log(doc.data());
    });
    console.log('Founded Messages :', this.channelMessagesFromDB);
    this.sortMessagesTime(this.channelMessagesFromDB);
  }

  /**
   * get the thread messages from a single message
   * push to thradMessagesFromDB with class Message
   * 
   * @param messageID {string} - id form the clicked message
   */
  async getThreadMessagesFromSingleMessage(messageID) {
    let channelId = this.filteredChannels[1];
    this.sharedService.currentThreadContent = [];
    const querySnapshotThread = await getDocs(collection(this.firestore, `channels/${channelId}/messages/${messageID}/thread`));
    querySnapshotThread.forEach((doc) => {
      this.sharedService.currentThreadContent.push(new Message(doc.data()));
      // console.log('Thread Data:', doc.data());
      // console.log(this.sharedService.currentThreadContent);
    });
    //set path in sharedService
    this.sharedService.threadPath = '';
    this.sharedService.threadPath = `channels/${channelId}/messages/${messageID}/thread`;
    this.sortMessagesTime(this.sharedService.currentThreadContent);
    console.log(this.sharedService.currentThreadContent);
  }

  /**
   * sort the messages by time
   * 
   */
  sortMessagesTime(array) {
    array.sort((a, b) => a.time - b.time);
  }
}
