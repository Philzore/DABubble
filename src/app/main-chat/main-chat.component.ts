import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GroupInfoPopupComponent } from '../group-info-popup/group-info-popup.component';
import { GroupMemberComponent } from '../group-member/group-member.component';
import { GroupAddMemberComponent } from '../group-add-member/group-add-member.component';
import { MainThreadComponent } from '../main-thread/main-thread.component';

@Component({
  selector: 'app-main-chat',
  templateUrl: './main-chat.component.html',
  styleUrls: ['./main-chat.component.scss']
})
export class MainChatComponent {
sidebarVisible: any;
  constructor(public dialog: MatDialog) {}

  openGroupInfoPopUp(): void {
    this.dialog.open(GroupInfoPopupComponent ,{panelClass: 'custom-logout-dialog'});
  }

  openGroupMemberPopUp(): void {
    this.dialog.open(GroupMemberComponent, {position: {top:'100px',right:'50px'}, panelClass: 'custom-logout-dialog'});
  }

  openAddMemberPopUp(): void {
    this.dialog.open(GroupAddMemberComponent,{panelClass: 'custom-logout-dialog'});
  }

}
