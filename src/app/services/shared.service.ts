import { Injectable } from '@angular/core';
import { Firestore, addDoc, and, arrayUnion, collection, doc, getDoc, getDocs, limit, onSnapshot, or, query, updateDoc, where } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, map, startWith } from 'rxjs';
import { Message } from '../models/message.class';
import { User } from '../models/user.class';
import { FormControl } from '@angular/forms';

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
  currentActiveChannel = new BehaviorSubject<string>('DaBubble');
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
  hideThreadWhenChangeChannel = false ;
  availableThread = true ;

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
    if (this.unsubChannels) {
      this.unsubChannels();
    }

    const channelCol = collection(this.firestore, 'channels');
    const channelSnapshot = await getDocs(channelCol);

    channelSnapshot.forEach(async (Channeldoc) => {
      let channelMessagePath = '';
      let channelMessageThreadPath = '';

      const singleChannel = doc(this.firestore, 'channels', Channeldoc.id)

      // ************** update channel creator **************
      if (Channeldoc.data()['created'] == oldName) {
        await updateDoc(singleChannel, {
          created: newName,
        });
      }
      // ************** end update channel creator **************

      // ************** update channel members **************
      // get all members from current Channel
      let membersOfCurrentChannel = Channeldoc.data()['members'];
      const index = membersOfCurrentChannel.findIndex(member => member.name === oldName)

      if (index !== -1) {
        //update complete members array of channel
        membersOfCurrentChannel[index].name = newName;
        await updateDoc(singleChannel, {
          members: membersOfCurrentChannel,
        });
      } else {
        //wurde nicht gefunden im Array
      }
      // ************** end update channel members **************

      // ************** update channel messages **************
      channelMessagePath = `channels/${Channeldoc.id}/messages`;
      const messageRef = collection(this.firestore, channelMessagePath);
      const queryMessage = query(messageRef, where('from', '==', oldName));
      const queryMessageFilter = await getDocs(queryMessage);

      //update docs in collection messages
      queryMessageFilter.forEach(async (docMsg) => {
        const singleMessageRef = doc(this.firestore, channelMessagePath, docMsg.id);
        await updateDoc(singleMessageRef, {
          from: newName,
        });
      });
      // ************** end update channel messages **************

      // ************** update Thred messages **************
      const allMessages = await getDocs(messageRef);
      for (const msgDoc of allMessages.docs) {
        channelMessageThreadPath = `channels/${Channeldoc.id}/messages/${msgDoc.id}/thread`;
        const threadRef = collection(this.firestore, channelMessageThreadPath);
        const queryThread = query(threadRef, where('from', '==', oldName));
        const queryThreadFilter = await getDocs(queryThread);

        await this.updateThreadMsgs(queryThreadFilter, channelMessageThreadPath, newName, Channeldoc.id, msgDoc.id);
      }


    });
    this.updateDirectMsgName(oldName, newName);
  }

  async updateThreadMsgs(queryThreadFilter, channelMessageThreadPath, newName, Channeldoc, msgDoc) {
    for (const docThread of queryThreadFilter.docs) {
      const singleThreadRef = doc(this.firestore, channelMessageThreadPath, docThread.id);
      await updateDoc(singleThreadRef, {
        from: newName,
      });
    }

  }

  async updateDirectMsgName(oldName: string, newName: string) {
    if (this.unsubDirectChat) {
      this.unsubDirectChat();
    }

    // get all Docs
    const directMsgRef = collection(this.firestore, 'directMessages');
    const directMsgDocs = await getDocs(directMsgRef);
    let between = { user1: '', user2: '' };
    let messages;

    // ************** update between **************
    directMsgDocs.forEach(async (directMsgdoc) => {

      const singleDirectMsg = doc(this.firestore, 'directMessages', directMsgdoc.id)

      between = directMsgdoc.data()['between'];

      if (between.user1 === oldName) {
        between.user1 = newName;
        await updateDoc(singleDirectMsg, {
          between: between,
        });
      } else if (between.user2 === oldName) {
        between.user2 = newName;
        await updateDoc(singleDirectMsg, {
          between: between,
        });
      }

      // ************** end update between **************

      // ************** update messages **************
      if (directMsgdoc.data()['messages']) {
        messages = directMsgdoc.data()['messages'];

        for (let index = 0; index < messages.length; index++) {
          const message = messages[index];

          if (message.from === oldName) {
            messages[index].from = newName;
          }
        }
        await updateDoc(singleDirectMsg, {
          messages: messages,
        });
      }

    });
    // ************** end update messages **************
    if (this.showDirectMessageView) {
      this.createSubscribeDirectChat()
    }
  }

  /**
   * get channel content from firestore
   * 
   * @param name {string} - the channel name which content to get 
   */
  async getChannelsFromDataBase(name: string) {
    this.filteredChannels = [];
    const channelRef = collection(this.firestore, 'channels');
    let filteredChannels ;
    if (name != 'first') {
      filteredChannels = query(channelRef, where('name', "==", name))
    } else if (name == 'first') {
      filteredChannels = query(channelRef, limit(1)) ;
    }
    const querySnapshot = await getDocs(filteredChannels);
    querySnapshot.forEach((doc) => {
      this.filteredChannels.push(doc.data(), doc.id);
    });
    this.templateIsReady = true;
  }

  /**
   * create subscribe for channel messages
   * 
   */
  createSubscribeChannelMessages() {
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
    this.sortMessagesTime(this.channelMessagesFromDB);
    this.originalArray = this.channelMessagesFromDB;
  }

  /**
    * create subscribe for channel messages
    * 
    */
  createSubscribeDirectChat() {
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
      directMsgSnap.data()['messages'].forEach((msg) => {
        const directMessage = new Message(msg);
        this.directMsgsFromDB.push(directMessage);
      });
    } else {
    }
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
    array.sort((a, b) => a.timeStamp - b.timeStamp);
  }



  /**
   * Direct Message to other User 
   */
  async openDirectMsg(user, yourName: string) {
    if (this.showDirectMessageView) {
      this.unsubDirectChat();
    }
    this.oppositeUser = user;
    const directMsgCollRef = collection(this.firestore, 'directMessages');

    if (! await this.checkDirectMsgExist(user.name, yourName, directMsgCollRef)) {
      const docRef = await addDoc((directMsgCollRef), {
        between: { user1: yourName, user2: user.name },
      });
      this.currentDirectMsgID = docRef.id;
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
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        this.currentDirectMsgID = doc.id;
      });
      return true
    } else {
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
    this.availableThread = true;
    this.showDirectMessageView = false;
    this.showNewMessageInput = false;
    this.showChannelView = true;
    this.hideThreadWhenChangeChannel = true ;
    // this.sharedService.createSubscribeChannelMessages();
  }

  showNewMessageHeader() {
    this.showNewMessageInput = !this.showNewMessageInput
    if (this.showNewMessageInput) {
      this.fillOptionsOfAutoComplete();
    }

  }




}
