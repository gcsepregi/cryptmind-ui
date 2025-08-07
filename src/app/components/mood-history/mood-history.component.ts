import { Component, OnDestroy, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgClass, DatePipe } from '@angular/common';
import { MoodService, MoodHistoryItem } from '../../services/mood.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mood-history',
  standalone: true,
  imports: [FontAwesomeModule, NgClass, DatePipe],
  templateUrl: './mood-history.component.html',
  styleUrl: './mood-history.component.scss'
})
export class MoodHistoryComponent implements OnInit, OnDestroy {
  moodHistory: MoodHistoryItem[] = [];
  private moodHistorySubscription: Subscription | null = null;

  constructor(private readonly moodService: MoodService) {}

  ngOnInit(): void {
    // Subscribe to mood history updates
    this.moodHistorySubscription = this.moodService.getMoodHistory().subscribe(history => {
      this.moodHistory = history;
    });
  }

  ngOnDestroy(): void {
    // Clean up subscription
    if (this.moodHistorySubscription) {
      this.moodHistorySubscription.unsubscribe();
    }
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
