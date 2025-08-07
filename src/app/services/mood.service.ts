import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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

  constructor() {
    // Initialize by loading mood from localStorage
    this.loadMoodFromStorage();
    this.loadMoodHistoryFromStorage();
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
    const moodData: MoodData = {
      mood,
      timestamp: new Date()
    };

    // Update the subject
    this.moodSubject.next(moodData);

    // Save to localStorage
    localStorage.setItem(MoodService.STORAGE_KEY, JSON.stringify({
      mood: moodData.mood,
      timestamp: moodData.timestamp.toISOString()
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
    // Create a new history item
    const historyItem: MoodHistoryItem = {
      id: this.generateId(),
      mood,
      timestamp: new Date()
    };

    // Get current history
    const currentHistory = this.moodHistorySubject.value;

    // Add new item to the beginning of the array
    const updatedHistory = [historyItem, ...currentHistory];

    // Update the subject
    this.moodHistorySubject.next(updatedHistory);

    // Save to localStorage
    this.saveMoodHistoryToStorage();
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
      history.map(item => ({
        id: item.id,
        mood: item.mood,
        timestamp: item.timestamp.toISOString()
      }))
    ));
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
        const moodTimestamp = new Date(timestamp);

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
        const history: MoodHistoryItem[] = historyData.map((item: any) => ({
          id: item.id,
          mood: item.mood,
          timestamp: new Date(item.timestamp)
        }));

        this.moodHistorySubject.next(history);
      } catch (e) {
        console.error('Error loading mood history', e);
        this.moodHistorySubject.next([]);
      }
    }
  }
}
