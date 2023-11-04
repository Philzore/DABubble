import { Injectable } from '@angular/core';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  public currentActiveChannel = new BehaviorSubject<string>('DaBubble');
  currentActiveChannel$ = this.currentActiveChannel.asObservable();

  private threadContainerVisibilitySubject = new BehaviorSubject<boolean>(true);
  threadContainerVisibility$ = this.threadContainerVisibilitySubject.asObservable();

  public isSidebarOpen = new BehaviorSubject<boolean>(false);

  currentThreadContent = [] ;
  threadPath : string = '' ;

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
}
