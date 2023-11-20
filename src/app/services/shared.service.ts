import { Injectable } from '@angular/core';
import { Firestore, arrayUnion, collection, doc, getDocs, onSnapshot, query, updateDoc, where } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, async } from 'rxjs';
import { Message } from '../models/message.class';


@Injectable({
  providedIn: 'root',
})
export class SharedService {
  //header
  headerContentReady:boolean = false ;

  //channels
  public currentActiveChannel = new BehaviorSubject<string>('DaBubble');
  currentActiveChannel$ = this.currentActiveChannel.asObservable();
  unsubChannels;
  filteredChannels: any[];

  //sidebarƒ
  public isSidebarOpen = new BehaviorSubject<boolean>(false);

  //main chat
  channelMessagesFromDB: any[];
  templateIsReady = false;

  //thread
  private threadContainerVisibilitySubject = new BehaviorSubject<boolean>(true);
  threadContainerVisibility$ = this.threadContainerVisibilitySubject.asObservable();
  threadPath: string = '';
  currentThreadContent = [];
  threadContentReady:boolean = false ;

  constructor(private firestore: Firestore) {
    // Initialize your service here if needed.
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

  async updateMembersInDatabase(members, id: string) {
    const channelRef = doc(this.firestore, 'channels', id);
    await updateDoc(channelRef, { members: arrayUnion(members) });
  }

  /**
   * Update the current active channel to be displayed in other components.
   * 
   * @param newValue {string} - New value to update the channel information
   */
  updateChannel(newValue: string) {
    this.currentActiveChannel.next(newValue);
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
  async getChannelsFromDataBase(name) {
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
    console.log('create channel sub');
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
  }

  
  /**
   * sort messages by time
   * 
   * @param array - which need to be sorted
   */
  sortMessagesTime(array) {
    array.sort((a, b) => a.time - b.time);
  }
}
