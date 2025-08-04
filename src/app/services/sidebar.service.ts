import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  private sidebarOpen$ = new BehaviorSubject<boolean>(false);

  public isOpened$ = this.sidebarOpen$.asObservable();

  get isOpen() {
    return this.sidebarOpen$.value;
  }

  toggle() {
    this.sidebarOpen$.next(!this.sidebarOpen$.value);
  }
}
