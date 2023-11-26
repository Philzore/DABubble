import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SharedService } from '../services/shared.service';
import { Firestore, addDoc, collection, doc, getDocs, onSnapshot, query, updateDoc, where, getDoc } from '@angular/fire/firestore';
import { GroupMemberInfoComponent } from '../group-member-info/group-member-info.component';
import { UserDataService } from '../services/user-data.service';

@Component({
  selector: 'app-group-info-popup',
  templateUrl: './group-info-popup.component.html',
  styleUrls: ['./group-info-popup.component.scss']
})
export class GroupInfoPopupComponent implements OnInit {
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
  isEditing = false;
  channelName = '';
  channelDescription = '';
  hideEditDescription = false;
  memberSubscriber:boolean = false ;

  /**
   * 
   * init of the class
   * 
   * @param dialog 
   * @param dialogRef 
   * @param dialogData 
   * @param sharedService 
   * @param firestore 
   * @param userDataService 
   */
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<GroupInfoPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private sharedService: SharedService,
    private firestore: Firestore,
    public userDataService: UserDataService
  ) { }

  /**
   * init of the component
   * 
   */
  ngOnInit(): void {
    this.currentChannel.info = this.dialogData[0];
    this.currentChannel.id = this.dialogData[1];
    this.channelName = this.currentChannel.info.name;
    this.channelDescription = this.currentChannel.info.description;
    this.memberSubscriber = this.checkIfMember() ;
  }

  /**
   * save the new channel name
   * 
   */
  saveChannelName() {
    this.currentChannel.info.name = this.channelName;
    this.sharedService.updateChannelInfoDatabase({ name: this.channelName }, this.currentChannel.id);
  }

  /**
   * save the new channel description
   * 
   */
  saveChannelDescription() {
    this.currentChannel.info.description = this.channelDescription;
    this.sharedService.updateChannelInfoDatabase({ description: this.channelDescription }, this.currentChannel.id);
  }

  /**
   * change view if edit the channel description
   * 
   */
  changeChannelDescription() {
    this.hideEditDescription = !this.hideEditDescription;
  }

  /**
   * open group member info component
   * 
   */
  openGroupMemberInfo() {
    this.dialog.open(GroupMemberInfoComponent);
  }

  /**
   * change view if edit the channel name
   * 
   */
  changeChannelName() {
    this.isEditing = !this.isEditing;
  }

  /**
   * leave the channel if the user is member
   * 
   */
  async leaveChannel() {
    const isNameInArray = this.currentChannel.info.members.some(member => member.name === this.userDataService.currentUser['name']);

    if (isNameInArray) {
      let userPosition = this.currentChannel.info.members.findIndex(member => member.name === this.userDataService.currentUser['name']);
      this.currentChannel.info.members.splice(userPosition, 1);

      const channelRef = doc(this.firestore, 'channels', this.currentChannel.id);
      const channelSnap = await getDoc(channelRef);
      await updateDoc(channelRef, { members: this.currentChannel.info.members }).then( ()=> {this.dialogRef.close({event : 'start'});});
      
    }
    
  }

  /**
   * check if the user is member of the current channel
   * 
   * @returns true , if the user is already member
   * @returns false , if the user is not a member
   */
  checkIfMember(){
    if (this.currentChannel.info.members.some(member => member.name === this.userDataService.currentUser['name'])) {
      return true
    } else {
      return false
    }
  }

}
