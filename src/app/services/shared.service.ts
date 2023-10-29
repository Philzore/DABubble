// shared.service.ts

import { Injectable } from '@angular/core';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {

  public currentActiveChannel = new BehaviorSubject<string>('Von Phil'); 
  currentActiveChannel$ = this.currentActiveChannel.asObservable();

  private threadContainerVisibilitySubject = new BehaviorSubject<boolean>(true);
  threadContainerVisibility$ = this.threadContainerVisibilitySubject.asObservable();

  private isSidebarOpen = new BehaviorSubject<boolean>(true);
  
  constructor(private firestore: Firestore) {
    // Initialize your service here if needed.
  }

  /**
   * function to update documents in collection channels
   * 
   * @param content {object} - content which should be updated
   * @param id {number} - id for firestore to save the new content
   */
  async updateChannelInfoDatabase(content:object,id:string){
    const channelRef = doc(this.firestore, 'channels' ,id);
    await updateDoc(channelRef, 
      content,
    );
  }

  /**
   * update channel to show in channel in other components
   * 
   * @param newValue {string} - input to update channel infos
   */
  updateChannel(newValue:string) {
    this.currentActiveChannel.next(newValue);
  }

  public toggleSidebar(): void {
    this.isSidebarOpen.next(!this.isSidebarOpen.value);
  }

  public isSidebarOpen$(): Observable<boolean> {
    return this.isSidebarOpen.asObservable();
  }
}
