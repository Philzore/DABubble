import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-group-member-info',
  templateUrl: './group-member-info.component.html',
  styleUrls: ['./group-member-info.component.scss']
})
export class GroupMemberInfoComponent {
  member: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.member = data.member;
  }
  

}
