import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable, of, catchError, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../app.config';
import {
  faGrinHearts,
  faLaugh,
  faSmile,
  faMeh,
  faFrown,
  faSadTear,
  faAngry
} from '@fortawesome/free-solid-svg-icons';

export interface MoodData {
  mood: string;
  timestamp: Date;
}

export interface MoodHistoryItem extends MoodData {
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class MoodService {
  private static readonly STORAGE_KEY = 'quickMood';
  private static readonly HISTORY_KEY = 'moodHistory';
  private static readonly MOOD_EXPIRY_HOURS = 12;

  // BehaviorSubject to track mood changes
  private moodSubject = new BehaviorSubject<MoodData | null>(null);
  private moodHistorySubject = new BehaviorSubject<MoodHistoryItem[]>([]);

  // Icons for different moods
  private moodIcons = {
    'love': faGrinHearts,
    'happy': faLaugh,
    'good': faSmile,
    'neutral': faMeh,
    'sad': faFrown,
    'very-sad': faSadTear,
    'angry': faAngry
  };

  // Mood options mapping for labels and CSS classes
  public readonly moodOptions = [
    { value: 'love', label: 'Love', colorClass: 'mood-text-love' },
    { value: 'happy', label: 'Happy', colorClass: 'mood-text-happy' },
    { value: 'good', label: 'Good', colorClass: 'mood-text-good' },
    { value: 'neutral', label: 'Neutral', colorClass: 'mood-text-neutral' },
    { value: 'sad', label: 'Sad', colorClass: 'mood-text-sad' },
    { value: 'very-sad', label: 'Very Sad', colorClass: 'mood-text-very-sad' },
    { value: 'angry', label: 'Angry', colorClass: 'mood-text-angry' }
  ];

  constructor(
    private readonly http: HttpClient,
    @Inject(BASE_URL) private readonly baseUrl: string
  ) {
    // Initialize by loading mood from localStorage
    this.loadMoodFromStorage();
    this.loadMoodHistoryFromStorage();

    // Sync with server on startup
    this.syncWithServer();
  }

  /**
   * Get an observable of the current mood
   */
  public getMood(): Observable<MoodData | null> {
    return this.moodSubject.asObservable();
  }

  /**
   * Set the current mood
   */
  public setMood(mood: string): void {
    // Create a new date and ensure it's valid
    const now = new Date();
    const moodData: MoodData = {
      mood,
      timestamp: now
    };

    // Update the subject
    this.moodSubject.next(moodData);

    // Ensure timestamp is valid before saving to localStorage
    let timestamp;
    try {
      if (!isNaN(now.getTime())) {
        timestamp = now.toISOString();
      } else {
        // If invalid for some reason, use current timestamp string
        timestamp = new Date().toISOString();
      }
    } catch (e) {
      timestamp = new Date().toISOString();
    }

    // Save to localStorage
    localStorage.setItem(MoodService.STORAGE_KEY, JSON.stringify({
      mood: moodData.mood,
      timestamp: timestamp
    }));

    // Add to mood history
    this.addToMoodHistory(mood);
  }

  /**
   * Get an observable of the mood history
   */
  public getMoodHistory(): Observable<MoodHistoryItem[]> {
    return this.moodHistorySubject.asObservable();
  }

  /**
   * Add a mood to the history
   */
  private addToMoodHistory(mood: string): void {
    this.addToMoodHistoryWithDate(mood, new Date());
  }

  /**
   * Add a mood to the history with a specific date
   */
  public addToMoodHistoryWithDate(mood: string, date: Date): void {
    // Create a new history item
    const historyItem: MoodHistoryItem = {
      id: this.generateId(),
      mood,
      timestamp: date
    };

    // Get current history
    const currentHistory = this.moodHistorySubject.value;

    // Add new item to the beginning of the array
    const updatedHistory = [historyItem, ...currentHistory];

    // Update the subject
    this.moodHistorySubject.next(updatedHistory);

    // Save to localStorage
    this.saveMoodHistoryToStorage();

    // Sync with server to save the new item
    // We'll use the sync endpoint which handles all operations
    this.syncWithServer();
  }

  /**
   * Update a mood history item
   */
  public updateMoodHistoryItem(id: string, mood: string): void {
    // Get current history
    const currentHistory = this.moodHistorySubject.value;

    // Find the item to update
    const itemIndex = currentHistory.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      return;
    }

    // Create updated item
    const updatedItem = {
      ...currentHistory[itemIndex],
      mood
    };

    // Update the history
    const updatedHistory = [...currentHistory];
    updatedHistory[itemIndex] = updatedItem;

    // Update the subject
    this.moodHistorySubject.next(updatedHistory);

    // Save to localStorage
    this.saveMoodHistoryToStorage();

    // Sync with server to update the item
    // We'll use the sync endpoint which handles all operations
    this.syncWithServer();
  }

  /**
   * Delete a mood history item
   */
  public deleteMoodHistoryItem(id: string): void {
    // Get current history
    const currentHistory = this.moodHistorySubject.value;

    // Filter out the item to delete
    const updatedHistory = currentHistory.filter(item => item.id !== id);

    // Update the subject
    this.moodHistorySubject.next(updatedHistory);

    // Save to localStorage
    this.saveMoodHistoryToStorage();

    // Sync with server to delete the item
    // We'll use the sync endpoint which handles all operations
    this.syncWithServer();
  }

  /**
   * Generate a unique ID for mood history items
   */
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Save mood history to localStorage
   */
  private saveMoodHistoryToStorage(): void {
    const history = this.moodHistorySubject.value;
    localStorage.setItem(MoodService.HISTORY_KEY, JSON.stringify(
      history.map(item => {
        // Ensure timestamp is a valid date before calling toISOString
        let timestamp;
        try {
          // Check if timestamp is valid
          if (item.timestamp && !isNaN(item.timestamp.getTime())) {
            timestamp = item.timestamp.toISOString();
          } else {
            // If invalid, use current date
            timestamp = new Date().toISOString();
          }
        } catch (e) {
          // If any error occurs, use current date
          timestamp = new Date().toISOString();
        }

        return {
          id: item.id,
          mood: item.mood,
          timestamp: timestamp
        };
      })
    ));
  }

  /**
   * Sync local mood history with server
   */
  private syncWithServer(): void {
    this.syncMoodHistories().subscribe();
  }

  /**
   * Public method to manually trigger synchronization
   * Returns an Observable that completes when sync is done
   */
  public syncMoodHistories(): Observable<void> {
    // Get local items to send to the server
    const localItems = this.moodHistorySubject.value;

    // Format local items for the server
    const formattedItems = localItems.map(item => {
      // Ensure timestamp is valid before sending to server
      let timestamp;
      try {
        if (item.timestamp && !isNaN(item.timestamp.getTime())) {
          timestamp = item.timestamp.toISOString();
        } else {
          timestamp = new Date().toISOString();
        }
      } catch (e) {
        timestamp = new Date().toISOString();
      }

      return {
        id: item.id,
        mood: item.mood,
        timestamp: timestamp,
        recorded_at: timestamp
      };
    });

    // Use the dedicated sync endpoint
    return this.http.post<any[]>(`${this.baseUrl}/mood_histories/sync`, {
      mood_histories: formattedItems
    }).pipe(
      catchError(error => {
        console.error('Error syncing mood histories with server', error);
        return of([]);
      }),
      map(serverItems => {
        // Process server response
        const processedItems = serverItems.map(item => {
          // Create date and validate it
          let timestamp;
          try {
            const parsedDate = new Date(item.timestamp);
            // Check if date is valid
            if (!isNaN(parsedDate.getTime())) {
              timestamp = parsedDate;
            } else {
              console.warn(`Invalid date found in server response for item ${item.id}, using current date instead`);
              timestamp = new Date();
            }
          } catch (e) {
            console.warn(`Error parsing date from server for item ${item.id}`, e);
            timestamp = new Date();
          }

          return {
            id: item.id,
            mood: item.mood,
            timestamp: timestamp
          };
        });

        // Update local storage with server items
        this.updateLocalStorageWithServerItems(processedItems);
        return void 0;
      })
    );
  }

  /**
   * Update local storage with server items
   * This method replaces the local mood history with the server's version
   * which is the source of truth after synchronization
   */
  private updateLocalStorageWithServerItems(serverItems: MoodHistoryItem[]): void {
    if (!serverItems || serverItems.length === 0) {
      console.warn('No server items received during sync');
      return;
    }

    // Sort items by timestamp (newest first)
    const sortedItems = [...serverItems].sort((a, b) =>
      b.timestamp.getTime() - a.timestamp.getTime()
    );

    // Update the subject with server items
    this.moodHistorySubject.next(sortedItems);

    // Save to localStorage
    this.saveMoodHistoryToStorage();

    console.log(`Synchronized ${serverItems.length} mood history items with server`);
  }

  /**
   * Clear the current mood
   */
  public clearMood(): void {
    this.moodSubject.next(null);
    localStorage.removeItem(MoodService.STORAGE_KEY);
  }

  /**
   * Get the label for a given mood
   */
  public getMoodLabel(mood: string): string {
    const option = this.moodOptions.find(opt => opt.value === mood);
    return option ? option.label : 'Unknown';
  }

  /**
   * Get the CSS class for a given mood's color
   */
  public getMoodColor(mood: string): string {
    const option = this.moodOptions.find(opt => opt.value === mood);
    return option ? option.colorClass : 'neon-text-purple'; // Default to accent color if not found
  }

  /**
   * Get the icon for a given mood
   */
  public getMoodIcon(mood: string) {
    return this.moodIcons[mood as keyof typeof this.moodIcons] || faSmile;
  }

  /**
   * Load mood from localStorage
   */
  private loadMoodFromStorage(): void {
    const savedMood = localStorage.getItem(MoodService.STORAGE_KEY);
    if (savedMood) {
      try {
        const { mood, timestamp } = JSON.parse(savedMood);

        // Create date and validate it
        let moodTimestamp;
        try {
          const parsedDate = new Date(timestamp);
          // Check if date is valid
          if (!isNaN(parsedDate.getTime())) {
            moodTimestamp = parsedDate;
          } else {
            // If invalid, use current date
            console.warn('Invalid date found in mood storage, using current date instead');
            moodTimestamp = new Date();
          }
        } catch (e) {
          console.warn('Error parsing date from mood storage', e);
          moodTimestamp = new Date();
        }

        // Check if mood has expired (older than 12 hours)
        const expiryTime = new Date();
        expiryTime.setHours(expiryTime.getHours() - MoodService.MOOD_EXPIRY_HOURS);

        if (moodTimestamp < expiryTime) {
          // Mood has expired, clear it
          this.clearMood();
        } else {
          // Mood is still valid
          this.moodSubject.next({ mood, timestamp: moodTimestamp });
        }
      } catch (e) {
        console.error('Error loading saved mood', e);
        this.clearMood();
      }
    }
  }

  /**
   * Load mood history from localStorage
   */
  private loadMoodHistoryFromStorage(): void {
    const savedHistory = localStorage.getItem(MoodService.HISTORY_KEY);
    if (savedHistory) {
      try {
        const historyData = JSON.parse(savedHistory);
        const history: MoodHistoryItem[] = historyData.map((item: any) => {
          // Create date and validate it
          let timestamp;
          try {
            const parsedDate = new Date(item.timestamp);
            // Check if date is valid
            if (!isNaN(parsedDate.getTime())) {
              timestamp = parsedDate;
            } else {
              // If invalid, use current date
              console.warn('Invalid date found in storage, using current date instead');
              timestamp = new Date();
            }
          } catch (e) {
            console.warn('Error parsing date from storage', e);
            timestamp = new Date();
          }

          return {
            id: item.id,
            mood: item.mood,
            timestamp: timestamp
          };
        });

        this.moodHistorySubject.next(history);
      } catch (e) {
        console.error('Error loading mood history', e);
        this.moodHistorySubject.next([]);
      }
    }
  }
}
