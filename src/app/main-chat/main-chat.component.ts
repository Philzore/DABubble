import { Component, ElementRef, EventEmitter, HostListener, Input, Output, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GroupInfoPopupComponent } from '../group-info-popup/group-info-popup.component';
import { GroupMemberComponent } from '../group-member/group-member.component';
import { GroupAddMemberComponent } from '../group-add-member/group-add-member.component';
import { SharedService } from '../services/shared.service';
import { Firestore, collection, getDocs, onSnapshot, query, where } from '@angular/fire/firestore';


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
  templateIsReady = false;

  @Output() threadClosed = new EventEmitter<void>();

<<<<<<< HEAD
  constructor(
    public dialog: MatDialog,
    public sharedService: SharedService,
    private elementRef: ElementRef,
    private firestore: Firestore) {
=======
  constructor(public dialog: MatDialog, public sharedService: SharedService, private elementRef: ElementRef, private firestore: Firestore) {
>>>>>>> ce5632a (worked on responsive layout)
    this.sharedService.isSidebarOpen$().subscribe((isOpen) => {
      this.isSidebarOpen = isOpen;
    });
    // this.openGroupInfoPopUp();
  }

  ngOnInit() {
    this.sharedService.currentActiveChannel$.subscribe((value) => {
      this.templateIsReady = false;
      console.log('Änderungen :', value);
      this.getChannelsFromDataBase(value);
    });

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
    this.dialog.open(GroupMemberComponent, { position: { top: '190px', right: '350px' }, panelClass: 'custom-logout-dialog' });
  }

  /**
   * open Add Member dialog
   * 
   */
  openAddMemberPopUp(): void {
    this.dialog.open(GroupAddMemberComponent, { position: { top: '190px', right: '350px' }, panelClass: 'custom-logout-dialog' });
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


  copyText(text: string): void {
    this.copiedText = text;
  }


  async getChannelsFromDataBase(name) {
    this.filteredChannels = [];
    const channelRef = collection(this.firestore, 'channels');
    const filteredChannels = query(channelRef, where('name', "==", name))

    const querySnapshot = await getDocs(filteredChannels);
    querySnapshot.forEach((doc) => {
<<<<<<< HEAD
      this.filteredChannels.push(doc.data(), doc.id);
=======
      this.filteredChannels.push(doc.data());
>>>>>>> ce5632a (worked on responsive layout)
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


  closeThread() {
    this.threadClosed.emit();
  }

}