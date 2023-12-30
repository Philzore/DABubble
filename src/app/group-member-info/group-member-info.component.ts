import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedService } from '../services/shared.service';
import { UserDataService } from '../services/user-data.service';

@Component({
  selector: 'app-group-member-info',
  templateUrl: './group-member-info.component.html',
  styleUrls: ['./group-member-info.component.scss']
})
export class GroupMemberInfoComponent {
  member: any;

  constructor
  (@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<GroupMemberInfoComponent>,
  public sharedService: SharedService,
  public userDataService: UserDataService
  ) 
  {
    this.member = data.member;
  }

  sendMessage(){
    this.member.avatar = this.member.imgNr;
    this.sharedService.openDirectMsg(this.member, this.userDataService.currentUser['name'])
    this.dialogRef.close();
  }
  
  
}
