import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-group-add-member',
  templateUrl: './group-add-member.component.html',
  styleUrls: ['./group-add-member.component.scss']
})
export class GroupAddMemberComponent {
  constructor(public dialogRef:MatDialogRef<GroupAddMemberComponent>) {}

}
