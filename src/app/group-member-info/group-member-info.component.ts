import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SharedService } from '../services/shared.service';

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
  private sharedService: SharedService
  ) 
  {
    this.member = data.member;
  }

  sendMessage(){
    
  }
  
  
}
