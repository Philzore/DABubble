import { Component, ElementRef, EventEmitter, HostListener, Input, Output, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GroupInfoPopupComponent } from '../group-info-popup/group-info-popup.component';
import { GroupMemberComponent } from '../group-member/group-member.component';
import { GroupAddMemberComponent } from '../group-add-member/group-add-member.component';
import { MainThreadComponent } from '../main-thread/main-thread.component';
import { SharedService } from '../shared.service';
import { Firestore, collection, getDocs, onSnapshot, query, where } from '@angular/fire/firestore';
import { BehaviorSubject, filter } from 'rxjs';

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

  constructor(public dialog: MatDialog, public sharedService: SharedService, private elementRef: ElementRef, private firestore: Firestore) {
    this.sharedService.isSidebarOpen$().subscribe((isOpen) => {
      this.isSidebarOpen = isOpen;
    });
    // this.openGroupInfoPopUp();
  }

  ngOnInit() {
    this.getChannelsFromDataBase();

    this.sharedService.currentActiveChannel$.subscribe((value) => {
      console.log('Änderungen :', value) ;
    });
    
  }

  openGroupInfoPopUp(): void {
    this.dialog.open(GroupInfoPopupComponent, { position: { top: '190px', right: '350px' }, panelClass: 'custom-logout-dialog' });
  }

  openGroupMemberPopUp(): void {
    this.dialog.open(GroupMemberComponent, { position: { top: '190px', right: '350px' }, panelClass: 'custom-logout-dialog' });
  }

  openAddMemberPopUp(): void {
    this.dialog.open(GroupAddMemberComponent, { position: { top: '190px', right: '350px' }, panelClass: 'custom-logout-dialog' });
  }


  toggleAddDataPopup(): void {
    this.showAddDataPopup = !this.showAddDataPopup;
  }


  toggleEmojiPopup(): void {
    this.showEmojiPopup = !this.showEmojiPopup;
  }


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


  async getChannelsFromDataBase() {
    this.filteredChannels = [];
    const channelRef = collection(this.firestore, 'channels');
    const filteredChannels = query(channelRef, where('name', "==", this.sharedService.currentActiveChannel$))
    console.log(this.sharedService.currentActiveChannel$)
    const querySnapshot = await getDocs(filteredChannels);
    querySnapshot.forEach((doc) => {
      this.filteredChannels.push(doc.data());
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


  createSubscribeChannels() {
    const unsubChannels = onSnapshot(collection(this.firestore, 'channels'), async (doc) => {
      await this.getChannelsFromDataBase();
    });
  }


  createSubscribeUsers() {
    const unsubUsers = onSnapshot(collection(this.firestore, 'users'), async (doc) => {
      await this.getUsersFromDatabase();
    });
  }


  closeThread() {
    this.threadClosed.emit();
  }

}