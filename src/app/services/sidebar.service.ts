import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  private sidebarOpen = false;

  get isOpen() {
    return this.sidebarOpen;
  }

  toggle() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
