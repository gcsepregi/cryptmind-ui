import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface MoodData {
  mood: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class MoodService {
  private static readonly STORAGE_KEY = 'quickMood';
  private static readonly MOOD_EXPIRY_HOURS = 12;

  // BehaviorSubject to track mood changes
  private moodSubject = new BehaviorSubject<MoodData | null>(null);

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
}
