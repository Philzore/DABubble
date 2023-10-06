import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GroupInfoPopupComponent } from '../group-info-popup/group-info-popup.component';
import { GroupMemberComponent } from '../group-member/group-member.component';
import { GroupAddMemberComponent } from '../group-add-member/group-add-member.component';

@Component({
  selector: 'app-main-chat',
  templateUrl: './main-chat.component.html',
  styleUrls: ['./main-chat.component.scss']
})
export class MainChatComponent {

  constructor(public dialog: MatDialog) {}

  openGroupInfoPopUp(): void {
    this.dialog.open(GroupInfoPopupComponent);
  }

  openGroupMemberPopUp(): void {
    this.dialog.open(GroupMemberComponent);
  }

  openAddMemberPopUp(): void {
    this.dialog.open(GroupAddMemberComponent);
  }


}
