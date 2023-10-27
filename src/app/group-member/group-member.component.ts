import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GroupAddMemberComponent } from '../group-add-member/group-add-member.component';

@Component({
  selector: 'app-group-member',
  templateUrl: './group-member.component.html',
  styleUrls: ['./group-member.component.scss']
})
export class GroupMemberComponent {

constructor(public dialog: MatDialog, public dialogRef:MatDialogRef<GroupAddMemberComponent>) {}

openAddMemberPopUp(): void {
  this.dialog.open(GroupAddMemberComponent,{panelClass: 'custom-logout-dialog'});
}

}
