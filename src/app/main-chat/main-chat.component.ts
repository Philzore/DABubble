import { Component, ElementRef, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GroupInfoPopupComponent } from '../group-info-popup/group-info-popup.component';
import { GroupMemberComponent } from '../group-member/group-member.component';
import { GroupAddMemberComponent } from '../group-add-member/group-add-member.component';
import { MainThreadComponent } from '../main-thread/main-thread.component';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-main-chat',
  templateUrl: './main-chat.component.html',
  styleUrls: ['./main-chat.component.scss']
})
export class MainChatComponent {
  copiedText: string = '';
  isSidebarOpen: boolean = true;
  showAddDataPopup: boolean = false;
  showEmojiPopup: boolean = false;
  showPersonPopup: boolean = false;
selectedEmoji: string;

  constructor(public dialog: MatDialog, private sharedService: SharedService, private elementRef: ElementRef) {
    this.sharedService.isSidebarOpen$().subscribe((isOpen) => {
      this.isSidebarOpen = isOpen;
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

  toggleSidebar(): void {
    this.sharedService.toggleSidebar();
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


}