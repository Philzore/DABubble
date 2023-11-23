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

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<GroupInfoPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private sharedService:SharedService,
    private firestore: Firestore,
    public userDataService:UserDataService
    ) { }

  ngOnInit(): void {
    this.currentChannel.info = this.dialogData[0];
    this.currentChannel.id = this.dialogData[1];
    this.channelName = this.currentChannel.info.name;
    this.channelDescription = this.currentChannel.info.description;
  }

  saveChannelName() {
    this.currentChannel.info.name = this.channelName;
    this.sharedService.updateChannelInfoDatabase({name : this.channelName},this.currentChannel.id);
  }

  saveChannelDescription() {
    this.currentChannel.info.description = this.channelDescription;
    this.sharedService.updateChannelInfoDatabase({description : this.channelDescription},this.currentChannel.id);
  }

  changeChannelDescription() {
    this.hideEditDescription = !this.hideEditDescription;
  }

  openGroupMemberInfo() {
    this.dialog.open(GroupMemberInfoComponent);
  }

  changeChannelName() {
    this.isEditing = !this.isEditing;
  }

  async getChannelsFromDataBase(name) {
    this.filteredChannels = [];
    const channelRef = collection(this.firestore, 'channels');
    const filteredChannels = query(channelRef, where('name', "==", name))
    const querySnapshot = await getDocs(filteredChannels);
    querySnapshot.forEach((doc) => {
      this.filteredChannels.push(doc.data(), doc.id);
      console.log(this.filteredChannels);
    });
    // this.templateIsReady = true;
  }

}
