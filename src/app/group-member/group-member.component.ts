import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GroupAddMemberComponent } from '../group-add-member/group-add-member.component';
import { UserDataService } from '../services/user-data.service';
import { GroupMemberInfoComponent } from '../group-member-info/group-member-info.component';
import { Firestore } from '@angular/fire/firestore';
import { AppComponent } from '../app.component';
import { SharedService } from '../services/shared.service';


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
    public userDataService: UserDataService,
    private firestore: Firestore,
    public appComponent: AppComponent,
    public sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any) { }


  ngOnInit(): void {
    this.currentChannel.info = this.dialogData[0];
    this.currentChannel.id = this.dialogData[1];
  }

  /**
   * open Add Member dialog
   * 
   */
  openAddMemberPopUp(): void {
    const isScreenWidthGreaterThan1200 = window.innerWidth > 1200;
  
    const dialogConfig = {
      data: this.sharedService.filteredChannels,
      position: isScreenWidthGreaterThan1200 ? { top: '180px', right: '70px' } : {},
      ...(isScreenWidthGreaterThan1200 ? { panelClass: 'custom-logout-dialog' } : {})
    };
  
    const dialogRef = this.dialog.open(GroupAddMemberComponent, dialogConfig);
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.event === 'start') {
        this.appComponent.showFeedback('Die Nutzer wurden dem Channel hinzugefügt');
      }
    });
  }

  openGroupMemberInfo(member: any) {
    this.dialogRef.close();
    this.dialog.open(GroupMemberInfoComponent, { data: { member: member } });
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
