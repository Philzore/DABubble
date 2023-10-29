import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GroupAddMemberComponent } from '../group-add-member/group-add-member.component';
import { ChannelInfo } from '../models/channel-info.class';
import { UserDataService } from '../services/user-data.service';

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
    public userDataService:UserDataService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any) { }


  ngOnInit(): void {
    this.currentChannel.info = this.dialogData[0];
    this.currentChannel.id = this.dialogData[1];
    console.log(this.currentChannel);
    this.checkOwnUser();
  }

  openAddMemberPopUp(): void {
    this.dialog.open(GroupAddMemberComponent, { panelClass: 'custom-logout-dialog' });
  }

  /**
   * render channel members html 
   * 
   */
  renderContentMembers() {
    let memberContainer = document.getElementById('members');
    for (let index = 0; index < this.currentChannel.info.members.length; index++) {
      const singleMember = this.currentChannel.info.members[index];
      memberContainer.innerHTML += `
      <img src="./assets/characters/character_1.png" alt=""> <p>{{ member }} <span *ngIf="false">(Du)</span></p>
      `;
    }
  }

  /**
   * to check who you are to show a simple (you) after the name
   * 
   */
  checkOwnUser() {
    let userName = this.userDataService.currentUser['name'];
    console.log(userName);
    console.log(this.currentChannel.info.members);
    if (this.currentChannel.info.members.includes(userName) ) {
      console.log('Ist dabei');
      let index = this.currentChannel.info.members.indexOf(userName);
    }
  }

  /**
   * find the avatars of the members
   * 
   */
  findAvatars() {

  }

}
