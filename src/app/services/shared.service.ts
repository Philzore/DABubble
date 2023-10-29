// shared.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {

  public currentActiveChannel = new BehaviorSubject<string>('Von Phil'); 
  currentActiveChannel$ = this.currentActiveChannel.asObservable();
  

  updateChannel(newValue:string) {
    this.currentActiveChannel.next(newValue);
  }


  private threadContainerVisibilitySubject = new BehaviorSubject<boolean>(true);
  threadContainerVisibility$ = this.threadContainerVisibilitySubject.asObservable();
  constructor() {
    // Initialize your service here if needed.
  }

  private isSidebarOpen = new BehaviorSubject<boolean>(true);

  public toggleSidebar(): void {
    this.isSidebarOpen.next(!this.isSidebarOpen.value);
  }

  public isSidebarOpen$(): Observable<boolean> {
    return this.isSidebarOpen.asObservable();
  }
}
