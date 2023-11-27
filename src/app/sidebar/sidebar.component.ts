import { Component, EventEmitter, Output, Injectable, ViewChild, Input, OnInit, HostListener } from '@angular/core'; // Import Injectable
import { MatDialog } from '@angular/material/dialog';
import { DialogCreateNewChannelComponent } from '../dialog-create-new-channel/dialog-create-new-channel.component';
import { trigger, state, style, animate, transition, sequence } from '@angular/animations';
import { Firestore, addDoc, and, collection, getDocs, onSnapshot, or, query, where } from '@angular/fire/firestore';
import { AppComponent } from '../app.component';
import { UserDataService } from '../services/user-data.service';
import { SharedService } from '../services/shared.service';
import { User } from '../models/user.class';
import { share } from 'rxjs';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('enterAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('500ms', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)', opacity: 1 }),
        animate('500ms', style({ transform: 'translateX(-100%)', opacity: 0 }))
      ])
    ]),
    trigger("dropDownMenu", [
      transition(":enter", [
        style({ height: 0, overflow: "hidden" }),
        sequence([
          animate("200ms", style({ height: "*" })),
        ])
      ]),
      transition(":leave", [
        style({ height: "*", overflow: "hidden" }),
        sequence([
          animate("200ms", style({ height: 0 }))
        ])
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(100%)' }),
        animate(500, style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateY(0)' }),
        animate(500, style({ opacity: 0, transform: 'translateY(-100%)' }))
      ])
    ])
  ]
})
export class SidebarComponent implements OnInit {
  @Output() changeChannel = new EventEmitter<string>();
  specificWidth = 1200;
  channelDropdown: boolean = false;
  messageDropdown: boolean = false;
  sidebarClose: boolean = false;
  workspaceText: string = 'schließen';
  channelsFromDataBase = [];

  userData = {};



  constructor(
    public dialog: MatDialog,
    public sharedService: SharedService,
    private firestore: Firestore,
    public appComponent: AppComponent,
    public userDataService: UserDataService) {

    this.createSubscribeChannels();
    this.createSubscribeUsers();

  }

  ngOnInit(): void {
    this.sharedService.isSidebarOpen$().subscribe((state) => {
      this.sidebarClose = state;
    });
    this.userData = this.userDataService.getCurrentUser();
  }

  /**
   * load channels from firestore and push to local array
   * 
   */
  async getChannelsFromDataBase() {
    this.channelsFromDataBase = [];
    const querySnapshotChannels = await getDocs(collection(this.firestore, 'channels'));
    querySnapshotChannels.forEach((doc) => {
      this.channelsFromDataBase.push(doc.data());
    });
    this.sharedService.channelsForFilter = this.channelsFromDataBase ;
  }

  /**
   * load users from firestore and push to local array
   * 
   */
  async getUsersFromDatabase() {
    this.userDataService.usersFromDatabase = [];
    const querySnapshotUsers = await getDocs(collection(this.firestore, 'users'));
    querySnapshotUsers.forEach((doc) => {
      this.userDataService.usersFromDatabase.push(new User(doc.data()));
    });
    this.sharedService.usersForFilter = this.userDataService.usersFromDatabase
  }

  /**
   * create subscribe for collection channels
   * when something changed then load channels from firestore again
   * 
   */
  createSubscribeChannels() {
    const unsubChannels = onSnapshot(collection(this.firestore, 'channels'), async (doc) => {
      await this.getChannelsFromDataBase();
    });
  }

  /**
   * create subscribe for collection users
   * when something changed then load users from firestore again
   * 
   */
  createSubscribeUsers() {
    const unsubUsers = onSnapshot(collection(this.firestore, 'users'), async (doc) => {
      await this.getUsersFromDatabase();
    });
  }

  /**
   * open dialog to create a new channel
   * when closing and new channel created then start animation
   * 
   */
  openDialog() {
    const dialogRef = this.dialog.open(DialogCreateNewChannelComponent, {
      panelClass: 'custom-normal-dialog',
      data: { channels: this.channelsFromDataBase },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.event == 'start') {
          this.appComponent.showFeedback('Channel created');
        }
      }
    });
  }

  /**
   * open drop down for channels
   * 
   */
  openDropdownChannels() {
    this.channelDropdown = !this.channelDropdown;
  }

  /**
   * open drop down for direct messages
   * 
   */
  openDropdownMessages() {
    this.messageDropdown = !this.messageDropdown;
  }

  /**
   * close sidebar with animation
   * 
   */
  closeSidebar() {
    this.sharedService.toggleSidebar();
    this.workspaceText = this.sidebarClose ? 'öffnen' : 'schließen';
  }

  closeSidebarResponsive() {
    if (window.innerWidth < this.specificWidth) {
      this.sharedService.toggleSidebar();
    }
  }

  /* Open Channel */
  openChannel(name) {
    this.sharedService.showChannelViewFct();
    this.sharedService.updateChannel(name);
  }


  // async openDirectMsg(user, yourName: string) {
  //   if (this.sharedService.showDirectMessageView) {
  //     this.sharedService.unsubDirectChat();
  //   }
  //   console.log(user);
  //   this.sharedService.oppositeUser = user ;
  //   const directMsgCollRef = collection(this.firestore, 'directMessages');
  //   console.log('Opposite : ', user.name, 'Your Name : ', yourName);

  //   if (! await this.checkDirectMsgExist(user.name, yourName, directMsgCollRef)) {
  //     const docRef = await addDoc((directMsgCollRef), {
  //       between: { user1 : yourName, user2 : user.name},
  //     });
  //     this.sharedService.currentDirectMsgID = docRef.id;
  //     // console.log('Chat ID', this.sharedService.currentDirectMsgID);
  //   }
  //   this.showDirectMessageView();
  // }

  // async checkDirectMsgExist(oppositeName: string, yourName: string, directMsgCollRef) {
  //   const chatBetween = [yourName, oppositeName] ;
  //   const q = query(directMsgCollRef, or( and (where('between.user1','==', yourName),where('between.user2','==', oppositeName)),
  //                                         and (where('between.user2','==', yourName),where('between.user1','==', oppositeName))
  //                                         ) //end of or
  //                                         ); //end of query function
  //   const querySnapshot = await getDocs(q);
  //   console.log(querySnapshot.empty);
  //   if (!querySnapshot.empty){
  //     console.log('Chat schon vorhanden');
  //     querySnapshot.forEach((doc) => {
  //       this.sharedService.currentDirectMsgID = doc.id;
  //     });
  //     // console.log('Chat ID', this.sharedService.currentDirectMsgID);
  //     return true
  //   } else {
  //     console.log('Chat Nicht vorhanden');
  //     return false
  //   }
  // }

  // showDirectMessageView() {
  //   this.sharedService.unsubChannels();
  //   this.sharedService.showChannelView = false ;
  //   this.sharedService.showDirectMessageView = true ;
  //   this.sharedService.createSubscribeDirectChat();
  // }

  // showChannelView() {
  //   if (this.sharedService.showDirectMessageView) {
  //     this.sharedService.unsubDirectChat();
  //   }
  //   this.sharedService.showDirectMessageView = false ;
  //   this.sharedService.showChannelView = true ;
  //   // this.sharedService.createSubscribeChannelMessages();
  // }

}
