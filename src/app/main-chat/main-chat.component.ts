import { Component } from '@angular/core';
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

  isSidebarOpen: boolean = true;
  showAddDataPopup: boolean = false;
  showEmojiPopup: boolean = false;
  showPersonPopup: boolean = true;

  constructor(public dialog: MatDialog, private sharedService: SharedService) {
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

}
