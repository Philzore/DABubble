import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GroupAddMemberComponent } from '../group-add-member/group-add-member.component';
import { ChannelInfo } from '../models/channel-info.class';

@Component({
  selector: 'app-group-member',
  templateUrl: './group-member.component.html',
  styleUrls: ['./group-member.component.scss']
})
export class GroupMemberComponent implements OnInit {
  currentChannel = {
    info: {
      name: '',
      members: [],
      created: '',
      description: ''
    },
    id: ''
  };

  // testKlasse = new ChannelInfo() ;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<GroupAddMemberComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any) { }


  ngOnInit(): void {
    this.currentChannel.info = this.dialogData[0];
    this.currentChannel.id = this.dialogData[1];
    console.log(this.currentChannel);
  }

  openAddMemberPopUp(): void {
    this.dialog.open(GroupAddMemberComponent, { panelClass: 'custom-logout-dialog' });
  }

}
