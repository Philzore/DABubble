import { Component, ElementRef, EventEmitter, HostListener, Input, Output, OnInit, ViewChild, AfterViewChecked, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GroupInfoPopupComponent } from '../group-info-popup/group-info-popup.component';
import { GroupMemberComponent } from '../group-member/group-member.component';
import { GroupAddMemberComponent } from '../group-add-member/group-add-member.component';
import { SharedService } from '../services/shared.service';
import { Firestore, addDoc, collection, doc, getDocs, onSnapshot, query, updateDoc, where } from '@angular/fire/firestore';
import { ChannelInfo } from '../models/channel-info.class';
import { Message } from '../models/message.class';
import { UserDataService } from '../services/user-data.service';


@Component({
  selector: 'app-main-chat',
  templateUrl: './main-chat.component.html',
  styleUrls: ['./main-chat.component.scss']
})
export class MainChatComponent implements OnInit {
  copiedText: string = '';
  isSidebarOpen: boolean = true;
  showAddDataPopup: boolean = false;
  showEmojiPopup: boolean = false;
  showPersonPopup: boolean = false;
  channelsFromDataBase = [];
  usersFromDatabase = [];
  userData = [];
  filteredChannels = [];
  channelMessagesFromDB = [];
  templateIsReady = false;
  channelKlassenTest = new ChannelInfo();
  message = new Message();
  @ViewChild('chatWrapper') private chatWrapper: ElementRef;
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
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
      this.renderer.setProperty(this.chatWrapper.nativeElement, 'scrollTop', this.chatWrapper.nativeElement.scrollHeight);
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

  async getUsersFromDatabase() {
    this.usersFromDatabase = [];
    const querySnapshotUsers = await getDocs(collection(this.firestore, 'users'));
    querySnapshotUsers.forEach((doc) => {
      this.usersFromDatabase.push(doc.data());
      // console.log(this.usersFromDatabase);
    });
  }


  // createSubscribeChannels() {
  //   const unsubChannels = onSnapshot(collection(this.firestore, 'channels'), async (doc) => {
  //     await this.getChannelsFromDataBase();
  //   });
  // }


  createSubscribeUsers() {
    const unsubUsers = onSnapshot(collection(this.firestore, 'users'), async (doc) => {
      await this.getUsersFromDatabase();
    });
  }


  toggleThread(messageID) {
    console.log(messageID);
    this.threadClosed.emit();
  }

  async createSubscribeChannelMessages() {
    let channelId = this.filteredChannels[1];
    const unsubChannels = onSnapshot(collection(this.firestore, `channels/${channelId}/messages`), async (doc) => {
      await this.getMessagesFromChannel();
    });
  }

  async messageSend() {
    this.message.from = this.userDataService.currentUser['name'];
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    this.message.time = formattedTime;
    this.message.text = this.copiedText;
    this.copiedText = '';
    //add subcollection
    let channelId = this.filteredChannels[1];
    const singleRef = doc(this.firestore, 'channels', channelId);
    const subcollectionMessages = await addDoc(collection(singleRef, 'messages'),
      this.message.toJSON()
    );
    await updateDoc(doc(this.firestore,`channels/${channelId}/messages`, subcollectionMessages.id), {
      id: subcollectionMessages.id,
    });
    //create thread subcollection
    const messageRef = doc(this.firestore,`channels/${channelId}/messages`, subcollectionMessages.id);
    console.log(messageRef.id);
    const threadSubcollection = await addDoc(collection(messageRef,`thread`),
      this.message.toJSON()
    );
  }

  
  async getMessagesFromChannel() {
    let channelId = this.filteredChannels[1];
    this.channelMessagesFromDB = [];
    const querySnapshotUsers = await getDocs(collection(this.firestore, `channels/${channelId}/messages`));
    querySnapshotUsers.forEach((doc) => {
      this.channelMessagesFromDB.push(new Message(doc.data()));
      console.log(doc.data());
    });
    console.log('Founded Messages :' , this.channelMessagesFromDB);
    this.sortMessagesTime();
  }

  async sendThreadMessage() {

  }

  async getThreadMessagesFromSingleMessage () {

  }

  sortMessagesTime() {
    this.channelMessagesFromDB.sort((a,b) => a.time - b.time) ;
    console.log('Sorted :' , this.channelMessagesFromDB);
  }
}
