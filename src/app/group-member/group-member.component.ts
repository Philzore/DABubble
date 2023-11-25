import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GroupAddMemberComponent } from '../group-add-member/group-add-member.component';
import { ChannelInfo } from '../models/channel-info.class';
import { UserDataService } from '../services/user-data.service';
import { GroupMemberInfoComponent } from '../group-member-info/group-member-info.component';
import { Firestore, addDoc, collection, doc, getDocs, onSnapshot, query, updateDoc, where, getDoc } from '@angular/fire/firestore';


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

  filteredChannels = [];

  // testKlasse = new ChannelInfo() ;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<GroupAddMemberComponent>,
    public userDataService:UserDataService,
    private firestore: Firestore,
    @Inject(MAT_DIALOG_DATA) public dialogData: any) { }


  ngOnInit(): void {
    this.currentChannel.info = this.dialogData[0];
    this.currentChannel.id = this.dialogData[1];
    console.log(this.currentChannel, this.currentChannel.info.members);
  }

  openAddMemberPopUp(): void {
    this.dialog.open(GroupAddMemberComponent, { panelClass: 'custom-logout-dialog' });
  }

  openGroupMemberInfo(member: any) {
    this.dialog.open(GroupMemberInfoComponent, { data: { member: member } });
    console.log('current memberinfo:', member);
  }

  /**
   * open Group Member dialog
   * 
   */
  openGroupMemberPopUp(): void {
    this.dialog.open(GroupMemberInfoComponent, { position: { top: '180px', right: '150px' }, panelClass: 'custom-logout-dialog', data: this.filteredChannels });
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

}
