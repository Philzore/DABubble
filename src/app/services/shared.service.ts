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

  currentChannelInformation = {};
  
  constructor(private firestore: Firestore) {
    // Initialize your service here if needed.
  }

  async updateChannelInfoDatabase(content:object,id:string){
    const channelRef = doc(this.firestore, 'channels' ,id);
    await updateDoc(channelRef, 
      content,
    );
  }

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
