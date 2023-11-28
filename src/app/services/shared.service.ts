import { Injectable, OnInit } from '@angular/core';
import { Firestore, addDoc, and, arrayUnion, collection, doc, getDoc, getDocs, onSnapshot, or, query, updateDoc, where } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, async, map, startWith } from 'rxjs';
import { Message } from '../models/message.class';
import { User } from '../models/user.class';
import { Channel } from '../models/channel.class';
import { FormControl } from '@angular/forms';
import { UserDataService } from './user-data.service';


@Injectable({
  providedIn: 'root',
})
export class SharedService {
  //auto complete
  myControl = new FormControl<string | User>('');
  options = [];
  filteredOptions: Observable<any[]>;
  usersForFilter = [];
  channelsForFilter = [];

  //filter header
  originalArray = [];
  currentUserName = '';

  //header
  headerContentReady: boolean = false;

  //channels
  public currentActiveChannel = new BehaviorSubject<string>('DaBubble');
  currentActiveChannel$ = this.currentActiveChannel.asObservable();
  unsubChannels;
  filteredChannels: any[];
  showChannelView: boolean = true;

  //sidebar
  public isSidebarOpen = new BehaviorSubject<boolean>(false);

  //main chat
  channelMessagesFromDB: any[];
  templateIsReady = false;
  messagePath: string = '';
  showNewMessageInput: boolean = false;

  //thread
  private threadContainerVisibilitySubject = new BehaviorSubject<boolean>(true);
  threadContainerVisibility$ = this.threadContainerVisibilitySubject.asObservable();
  threadPath: string = '';
  currentThreadContent = [];
  threadContentReady: boolean = false;

  //direct messages
  showDirectMessageView: boolean = false;
  oppositeUser: User;
  directMsgsFromDB = [];
  currentDirectMsgID = '';
  directChatReady = false;
  unsubDirectChat;

  constructor(
    private firestore: Firestore,
  ) {
    // Initialize your service here if needed.
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {

        const name = typeof value === 'string' ? value : value?.name;
        this.checkInput(value)
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );
  }

  async checkInput(value) {
    if (value && typeof value === 'object') {
      const name = value.name;
      const channel = value.channel;
      let cuttedStr = { name: '', channel: '' };

      if (name) {
        cuttedStr.name = value.name.substring(2);
        let index = this.usersForFilter.findIndex(obj => obj.name === cuttedStr.name);
        await this.openDirectMsg(this.usersForFilter[index], this.currentUserName);
      } else if (channel) {
        cuttedStr.channel = value.channel.substring(2);
        this.showChannelViewFct();
        this.updateChannel(cuttedStr.channel);
        console.log('return', channel);
      }
    }
  }

  /**
   * 
   * 
   * @param value input
   * @returns clicked option and display in html
   */
  displayFn(value): string {
    if (value && typeof value === 'object') {
      const name = value.name;
      const channel = value.channel;

      if (name && channel) {
        // Wenn sowohl name als auch channel vorhanden sind, zeige beide an
        return `${name} (${channel})`;
      } else if (name) {
        // Wenn nur name vorhanden ist, zeige nur name an
        return `${name}`;
      } else if (channel) {
        // Wenn nur channel vorhanden ist, zeige nur channel an
        return `${channel}`;
      }
    }

    // Wenn der Wert nicht korrekt verarbeitet werden kann, gib einen leeren String zurück
    return '';
  }

  _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => {
      if (option.name) {
        return option.name.toLowerCase().includes(filterValue);
      } else if (option.channel) {
        return option.channel.toLowerCase().includes(filterValue);
      }
      return false;
    });
  }

  fillOptionsOfAutoComplete() {
    this.options = [];
    this.usersForFilter.forEach((user) => {
      this.options.push({ name: `@ ${user.name}` });
    });
    this.channelsForFilter.forEach((channel) => {
      this.options.push({ channel: `# ${channel.name}` });
    });
    console.log('Options :', this.options);
  }

  /**
   * Function to update documents in the "channels" collection.
   * 
   * @param content {object} - Content to be updated
   * @param id {string} - Document ID in Firestore
   */
  async updateChannelInfoDatabase(content: object, id: string) {
    const channelRef = doc(this.firestore, 'channels', id);
    await updateDoc(channelRef, content);
  }

  /**
   * update channel members in database
   * 
   * @param members {object} - name and img from user
   * @param id {string} - which channel the users add to members
   */
  async updateMembersInDatabase(members, id: string) {
    const channelRef = doc(this.firestore, 'channels', id);
    const channelSnap = await getDoc(channelRef);
    await updateDoc(channelRef, { members: arrayUnion(members) });
  }

  /**
   * Update the current active channel to be displayed in other components.
   * 
   * @param newValue {string} - New value to update the channel information
   */
  async updateChannel(newValue: string) {
    this.templateIsReady = false;
    await this.getChannelsFromDataBase(newValue);
    this.createSubscribeChannelMessages();
  }

  /**
   * Toggle the state of the sidebar (open or closed).
   */
  toggleSidebar(): void {
    this.isSidebarOpen.next(!this.isSidebarOpen.value);
  }

  /**
   * Get the observable for the sidebar state.
   * 
   * @returns {Observable<boolean>} - Observable to track the sidebar state
   */
  isSidebarOpen$(): Observable<boolean> {
    return this.isSidebarOpen.asObservable();
  }

  /**
   * update user name
   * 
   * @param oldName - to check where in firestore to replace with the new name
   * @param newName - replaced name with oldName
   */
  async updateName(oldName: string, newName: string) {
    this.unsubChannels();
    const channelCol = collection(this.firestore, 'channels');
    const channelSnapshot = await getDocs(channelCol);
    let channelMessagePath = '';
    let channelMessageThreadPath = '';
    console.log('Old Name :', oldName);

    //update channel creator

    channelSnapshot.forEach(async (Channeldoc) => {
      console.log('Channel schleife', Channeldoc.id);
      channelMessagePath = `channels/${Channeldoc.id}/messages`;


      const messageRef = collection(this.firestore, channelMessagePath);

      const queryMessage = query(messageRef, where('from', '==', oldName));
      const queryMessageFilter = await getDocs(queryMessage);

      //update docs in collection messages
      queryMessageFilter.forEach(async (docMsg) => {

        console.log('Message Schleife', docMsg.id);
        const singleMessageRef = doc(this.firestore, channelMessagePath, docMsg.id);
        await updateDoc(singleMessageRef, {
          from: newName,
        });

        //update thread messages
        channelMessageThreadPath = `channels/${Channeldoc.id}/messages/${docMsg.id}/thread`;
        const threadRef = collection(this.firestore, channelMessageThreadPath);
        const queryThread = query(threadRef, where('from', '==', oldName));
        const queryThreadFilter = await getDocs(queryThread);

        queryThreadFilter.forEach(async (docThread) => {
          const singleThreadRef = doc(this.firestore, channelMessageThreadPath, docThread.id);
          await updateDoc(singleThreadRef, {
            from: newName,
          });
        });
      });


    });

  }

  /**
   * get channel content from firestore
   * 
   * @param name {string} - the channel name which content to get 
   */
  async getChannelsFromDataBase(name: string) {
    this.filteredChannels = [];
    const channelRef = collection(this.firestore, 'channels');
    const filteredChannels = query(channelRef, where('name', "==", name))
    const querySnapshot = await getDocs(filteredChannels);
    querySnapshot.forEach((doc) => {
      this.filteredChannels.push(doc.data(), doc.id);
      console.log(this.filteredChannels);
    });
    this.templateIsReady = true;
  }

  /**
   * create subscribe for channel messages
   * 
   */
  createSubscribeChannelMessages() {
    console.log('create Main Chat sub');
    let channelId = this.filteredChannels[1];

    this.unsubChannels = onSnapshot(collection(this.firestore, `channels/${channelId}/messages`), async (doc) => {
      await this.getMessagesFromChannel();
    });
  }


  /**
   * get the messages from firestore and then sort the array
   * 
   */
  async getMessagesFromChannel() {
    let channelId = this.filteredChannels[1];
    this.channelMessagesFromDB = [];
    const querySnapshotMessages = await getDocs(collection(this.firestore, `channels/${channelId}/messages`));
    querySnapshotMessages.forEach(async (doc) => {
      this.channelMessagesFromDB.push(new Message(doc.data()));
    });
    console.log('Founded Messages :', this.channelMessagesFromDB);
    this.sortMessagesTime(this.channelMessagesFromDB);
    this.originalArray = this.channelMessagesFromDB;
  }

  /**
    * create subscribe for channel messages
    * 
    */
  createSubscribeDirectChat() {
    console.log('create Direct Chat Sub');
    // const directMsgRef = collection(this.firestore, 'directMessages' , this.currentDirectMsgID);
    this.unsubDirectChat = onSnapshot(doc(this.firestore, 'directMessages', this.currentDirectMsgID), async (doc) => {
      await this.getDirectMsgFromDatabase();
    });
  }

  /**
   * get direct messages from database
   * 
   */
  async getDirectMsgFromDatabase() {
    this.directChatReady = false;
    this.directMsgsFromDB = [];
    const docRef = doc(this.firestore, 'directMessages', this.currentDirectMsgID);
    const directMsgSnap = await getDoc(docRef);

    if (directMsgSnap.exists && directMsgSnap.data()['messages']) {
      console.log('direct msg data : ', directMsgSnap.data()['messages']);
      directMsgSnap.data()['messages'].forEach((msg) => {
        const directMessage = new Message(msg);
        this.directMsgsFromDB.push(directMessage);
      });
    } else {
      console.log('No direct MSG Document found, content empty');
    }
    console.log('Msgs for current direct content:', this.directMsgsFromDB);
    this.sortMessagesTime(this.directMsgsFromDB);
    this.directChatReady = true;
    this.originalArray = this.directMsgsFromDB;
  }


  /**
   * sort messages by time
   * 
   * @param array - which need to be sorted
   */
  sortMessagesTime(array) {
    array.sort((a, b) => a.time - b.time);
  }



  /**
   * Direct Message to other User 
   */
  async openDirectMsg(user, yourName: string) {
    if (this.showDirectMessageView) {
      this.unsubDirectChat();
    }
    console.log(user);
    this.oppositeUser = user;
    const directMsgCollRef = collection(this.firestore, 'directMessages');
    console.log('Opposite : ', user.name, 'Your Name : ', yourName);

    if (! await this.checkDirectMsgExist(user.name, yourName, directMsgCollRef)) {
      const docRef = await addDoc((directMsgCollRef), {
        between: { user1: yourName, user2: user.name },
      });
      this.currentDirectMsgID = docRef.id;
      // console.log('Chat ID', this.sharedService.currentDirectMsgID);
    }
    this.showDirectMessageViewFct();
  }

  /**
   * Checking if Chat between User already exists
   */
  async checkDirectMsgExist(oppositeName: string, yourName: string, directMsgCollRef) {
    const chatBetween = [yourName, oppositeName];
    const q = query(directMsgCollRef, or(and(where('between.user1', '==', yourName), where('between.user2', '==', oppositeName)),
      and(where('between.user2', '==', yourName), where('between.user1', '==', oppositeName))
    ) //end of or
    ); //end of query function
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot.empty);
    if (!querySnapshot.empty) {
      console.log('Chat schon vorhanden');
      querySnapshot.forEach((doc) => {
        this.currentDirectMsgID = doc.id;
      });
      // console.log('Chat ID', this.sharedService.currentDirectMsgID);
      return true
    } else {
      console.log('Chat Nicht vorhanden');
      return false
    }
  }

  /**
   * Showing directmessage view
   */
  showDirectMessageViewFct() {
    this.unsubChannels();
    this.showChannelView = false;
    this.showNewMessageInput = false;
    this.showDirectMessageView = true;
    this.createSubscribeDirectChat();
  }

  /**
   * Showing Channel view
   */
  showChannelViewFct() {
    if (this.showDirectMessageView) {
      this.unsubDirectChat();
    }
    this.showDirectMessageView = false;
    this.showNewMessageInput = false;
    this.showChannelView = true;
    // this.sharedService.createSubscribeChannelMessages();
  }

  showNewMessageHeader() {
    this.showNewMessageInput = !this.showNewMessageInput
    if (this.showNewMessageInput) {
      this.fillOptionsOfAutoComplete();
    }

  }




}
