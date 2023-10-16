// shared.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private isSidebarOpen = new BehaviorSubject<boolean>(true);

  public toggleSidebar(): void {
    this.isSidebarOpen.next(!this.isSidebarOpen.value);
  }

  public isSidebarOpen$(): Observable<boolean> {
    return this.isSidebarOpen.asObservable();
  }
}
