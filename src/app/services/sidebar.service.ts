import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private static readonly STORAGE_KEY = 'sidebarState';

  private sidebarOpen$ = new BehaviorSubject<boolean>(this.loadStateFromStorage());
  private activeRoute$ = new BehaviorSubject<string>('');

  public isOpened$ = this.sidebarOpen$.asObservable();
  public activeRoute = this.activeRoute$.asObservable();

  constructor(private router: Router) {
    // BehaviorSubject is already initialized with the stored state in the declaration

    // Subscribe to router events to track the active route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Extract the base route (first segment)
      const url = event.urlAfterRedirects;
      const baseRoute = url.split('/')[1] || '';
      this.activeRoute$.next(baseRoute ? `/${baseRoute}` : '/');
    });
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

  /**
   * Check if the given route is the currently active route
   * @param route The route to check (e.g., '/' or '/journals')
   * @returns True if the route is active, false otherwise
   */
  isRouteActive(route: string): boolean {
    return this.activeRoute$.value === route;
  }
}
