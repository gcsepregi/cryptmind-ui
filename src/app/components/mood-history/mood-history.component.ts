import { Component, OnDestroy, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgClass, DatePipe } from '@angular/common';
import { MoodService, MoodHistoryItem } from '../../services/mood.service';
import { Subscription } from 'rxjs';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface CalendarDay {
  date: Date;
  isToday: boolean;
  isCurrentMonth: boolean;
  isFirstOfMonth: boolean;
  moods: MoodHistoryItem[];
  aggregatedMoods: AggregatedMood[];
  interpolatedColor: string;
  dominantMood: string | null;
}

interface SelectedDayDetails {
  date: Date;
  moods: MoodHistoryItem[];
  aggregatedMoods: AggregatedMood[];
}

interface MoodCount {
  mood: string;
  count: number;
}

interface AggregatedMood {
  mood: string;
  count: number;
  percentage: number;
  sampleItem: MoodHistoryItem;
}

@Component({
  selector: 'app-mood-history',
  standalone: true,
  imports: [FontAwesomeModule, NgClass, DatePipe],
  templateUrl: './mood-history.component.html',
  styleUrl: './mood-history.component.scss'
})
export class MoodHistoryComponent implements OnInit, OnDestroy {
  moodHistory: MoodHistoryItem[] = [];
  moodOptions: any[] = [];
  calendarDays: CalendarDay[] = [];
  weekdays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  currentDate: Date = new Date();
  today: Date = new Date();
  selectedMood: MoodHistoryItem | null = null;
  selectedDay: SelectedDayDetails | null = null;
  mostCommonMood: MoodCount = { mood: 'neutral', count: 0 };
  currentDateRangeText: string = '';

  // Icons
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;

  private moodHistorySubscription: Subscription | null = null;

  constructor(private readonly moodService: MoodService) {
    this.moodOptions = this.moodService.moodOptions;
  }

  ngOnInit(): void {
    // Subscribe to mood history updates
    this.moodHistorySubscription = this.moodService.getMoodHistory().subscribe(history => {
      this.moodHistory = history;
      this.generateCalendarDays();
      this.calculateMoodStats();
    });
  }

  ngOnDestroy(): void {
    // Clean up subscription
    if (this.moodHistorySubscription) {
      this.moodHistorySubscription.unsubscribe();
    }
  }

  // Generate calendar days for the current view
  private generateCalendarDays(): void {
    this.calendarDays = [];

    // Get the first day of the week for the current date
    const startDate = new Date(this.currentDate);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    // Generate 28 days (4 weeks)
    for (let i = 0; i < 28; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      const isToday = this.isSameDay(date, this.today);
      const isCurrentMonth = date.getMonth() === this.currentDate.getMonth();
      const isFirstOfMonth = date.getDate() === 1;

      // Get moods for this day
      const moods = this.getMoodsForDay(date);

      // Aggregate moods by type
      const aggregatedMoods = this.aggregateMoodsByType(moods);

      // Calculate interpolated color for the day
      const interpolatedColor = this.calculateInterpolatedColor(aggregatedMoods);

      // Determine dominant mood (if any)
      const dominantMood = aggregatedMoods.length > 0 ? aggregatedMoods[0].mood : null;

      this.calendarDays.push({
        date,
        isToday,
        isCurrentMonth,
        isFirstOfMonth,
        moods,
        aggregatedMoods,
        interpolatedColor,
        dominantMood
      });
    }

    // Update the date range text
    this.updateDateRangeText();
  }

  // Update the text showing the current date range
  private updateDateRangeText(): void {
    const startDate = this.calendarDays[0].date;
    const endDate = this.calendarDays[this.calendarDays.length - 1].date;

    const startMonth = startDate.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' });

    if (startMonth === endMonth) {
      this.currentDateRangeText = `${startMonth} ${startDate.getFullYear()}`;
    } else {
      this.currentDateRangeText = `${startMonth} - ${endMonth} ${endDate.getFullYear()}`;
    }
  }

  // Get moods for a specific day
  private getMoodsForDay(date: Date): MoodHistoryItem[] {
    return this.moodHistory.filter(item => {
      const itemDate = new Date(item.timestamp);
      return this.isSameDay(itemDate, date);
    });
  }

  // Aggregate moods by type for a day
  private aggregateMoodsByType(moods: MoodHistoryItem[]): AggregatedMood[] {
    if (moods.length === 0) {
      return [];
    }

    // Group moods by type
    const moodGroups = new Map<string, MoodHistoryItem[]>();

    moods.forEach(item => {
      if (!moodGroups.has(item.mood)) {
        moodGroups.set(item.mood, []);
      }
      moodGroups.get(item.mood)?.push(item);
    });

    // Convert to AggregatedMood array
    const result: AggregatedMood[] = [];
    const totalMoods = moods.length;

    moodGroups.forEach((items, mood) => {
      result.push({
        mood,
        count: items.length,
        percentage: items.length / totalMoods,
        sampleItem: items[0] // Use the first item as a sample
      });
    });

    // Sort by count (highest first)
    return result.sort((a, b) => b.count - a.count);
  }

  // Calculate interpolated color for a day based on mood frequencies
  private calculateInterpolatedColor(aggregatedMoods: AggregatedMood[]): string {
    if (aggregatedMoods.length === 0) {
      return 'transparent';
    }

    // If there's only one mood, return its color class
    if (aggregatedMoods.length === 1) {
      return this.getMoodColor(aggregatedMoods[0].mood);
    }

    // For multiple moods, create a gradient
    const gradientStops: string[] = [];
    let currentPosition = 0;

    // Sort by percentage (highest first) to give more weight to dominant moods
    const sortedMoods = [...aggregatedMoods].sort((a, b) => b.percentage - a.percentage);

    sortedMoods.forEach((mood) => {
      // Get the CSS variable for this mood's color
      const colorClass = this.getMoodColor(mood.mood);
      const colorVar = this.getMoodColorVariable(colorClass);

      // Calculate the percentage of the gradient this mood should occupy
      const percentage = mood.percentage * 100;

      // Add gradient stops
      gradientStops.push(`var(${colorVar}) ${currentPosition}%`);
      currentPosition += percentage;
      gradientStops.push(`var(${colorVar}) ${currentPosition}%`);
    });

    return `linear-gradient(135deg, ${gradientStops.join(', ')})`;
  }

  // Get the CSS variable name from a mood color class
  private getMoodColorVariable(colorClass: string): string {
    // Map from color classes to CSS variables
    const colorMap: {[key: string]: string} = {
      'mood-text-love': '--mood-color-love',
      'mood-text-happy': '--mood-color-happy',
      'mood-text-good': '--mood-color-good',
      'mood-text-neutral': '--mood-color-neutral',
      'mood-text-sad': '--mood-color-sad',
      'mood-text-very-sad': '--mood-color-very-sad',
      'mood-text-angry': '--mood-color-angry'
    };

    return colorMap[colorClass] || '--accent-color';
  }

  // Check if two dates are the same day
  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  // Calculate mood statistics
  private calculateMoodStats(): void {
    if (this.moodHistory.length === 0) {
      this.mostCommonMood = { mood: 'neutral', count: 0 };
      return;
    }

    // Count occurrences of each mood
    const moodCounts = new Map<string, number>();

    this.moodHistory.forEach(item => {
      const count = moodCounts.get(item.mood) || 0;
      moodCounts.set(item.mood, count + 1);
    });

    // Find the most common mood
    let maxCount = 0;
    let maxMood = 'neutral';

    moodCounts.forEach((count, mood) => {
      if (count > maxCount) {
        maxCount = count;
        maxMood = mood;
      }
    });

    this.mostCommonMood = { mood: maxMood, count: maxCount };
  }

  // Navigate to previous week
  previousWeek(): void {
    const newDate = new Date(this.currentDate);
    newDate.setDate(newDate.getDate() - 7);
    this.currentDate = newDate;
    this.generateCalendarDays();
  }

  // Navigate to next week
  nextWeek(): void {
    const newDate = new Date(this.currentDate);
    newDate.setDate(newDate.getDate() + 7);
    this.currentDate = newDate;
    this.generateCalendarDays();
  }

  // Show details for a specific day
  showDayDetails(day: CalendarDay): void {
    if (day.moods.length === 0) {
      return; // Don't show popup for days with no moods
    }

    // Sort moods by time (newest first)
    const sortedMoods = [...day.moods].sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    this.selectedDay = {
      date: day.date,
      moods: sortedMoods,
      aggregatedMoods: day.aggregatedMoods
    };
  }

  // Show details for a specific mood
  showMoodDetails(mood: MoodHistoryItem): void {
    this.selectedMood = mood;
  }

  // Close all details
  closeDetails(): void {
    this.selectedMood = null;
    this.selectedDay = null;
  }

  // Method to get the label for a given mood
  getMoodLabel(mood: string): string {
    return this.moodService.getMoodLabel(mood);
  }

  // Method to get the color for a given mood
  getMoodColor(mood: string): string {
    return this.moodService.getMoodColor(mood);
  }

  // Method to get the icon for a given mood
  getMoodIcon(mood: string) {
    return this.moodService.getMoodIcon(mood);
  }
}
