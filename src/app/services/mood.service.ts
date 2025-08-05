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

  // Mood options mapping for labels and colors
  public readonly moodOptions = [
    { value: 'love', label: 'Love', color: '#ff6b81' },
    { value: 'happy', label: 'Happy', color: '#feca57' },
    { value: 'good', label: 'Good', color: '#1dd1a1' },
    { value: 'neutral', label: 'Neutral', color: '#5f27cd' },
    { value: 'sad', label: 'Sad', color: '#54a0ff' },
    { value: 'very-sad', label: 'Very Sad', color: '#2e86de' },
    { value: 'angry', label: 'Angry', color: '#ee5253' }
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
   * Get the color for a given mood
   */
  public getMoodColor(mood: string): string {
    const option = this.moodOptions.find(opt => opt.value === mood);
    return option ? option.color : '#a259f7'; // Default to accent color if not found
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
