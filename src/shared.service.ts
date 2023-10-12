import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private sideBarVisible = new BehaviorSubject<boolean>(true);
  private threadVisible = new BehaviorSubject<boolean>(true);

  sidebarVisible$ = this.sideBarVisible.asObservable();
  threadVisible$ = this.threadVisible.asObservable();

  setSidebarVisibility(visible: boolean) {
    this.sideBarVisible.next(visible);
  }

  setThreadVisibility(visible: boolean) {
    this.threadVisible.next(visible);
  }


  constructor() { }
}
