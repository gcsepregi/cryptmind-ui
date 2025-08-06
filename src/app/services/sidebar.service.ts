import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private static readonly STORAGE_KEY = 'sidebarState';

  private sidebarOpen$ = new BehaviorSubject<boolean>(this.loadStateFromStorage());

  public isOpened$ = this.sidebarOpen$.asObservable();

  constructor() {
    // BehaviorSubject is already initialized with the stored state in the declaration
  }

  get isOpen() {
    return this.sidebarOpen$.value;
  }

  toggle() {
    const newState = !this.sidebarOpen$.value;
    this.sidebarOpen$.next(newState);
    this.saveStateToStorage(newState);
  }

  /**
   * Save sidebar state to localStorage
   */
  private saveStateToStorage(isOpen: boolean): void {
    localStorage.setItem(SidebarService.STORAGE_KEY, JSON.stringify({ isOpen }));
  }

  /**
   * Load sidebar state from localStorage
   */
  private loadStateFromStorage(): boolean {
    const savedState = localStorage.getItem(SidebarService.STORAGE_KEY);
    if (savedState) {
      try {
        const { isOpen } = JSON.parse(savedState);
        return isOpen;
      } catch (e) {
        console.error('Error loading saved sidebar state', e);
        return false;
      }
    }
    return false;
  }
}
