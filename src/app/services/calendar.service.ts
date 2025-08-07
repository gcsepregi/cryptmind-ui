import { Injectable } from '@angular/core';
import { Journal } from '../models/journal.model';

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  entries: Journal[];
}

@Injectable({ providedIn: 'root' })
export class CalendarService {
  getMonthCalendar(year: number, month: number, journals: Journal[]): CalendarDay[] {
    const days: CalendarDay[] = [];
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) - 6 (Sat)
    const daysInMonth = lastDayOfMonth.getDate();

    // Previous month's days to fill first week
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const prevMonthLastDay = new Date(prevYear, prevMonth + 1, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(prevYear, prevMonth, prevMonthLastDay - i);
      days.push({
        date,
        isCurrentMonth: false,
        entries: this.entriesForDate(date, journals)
      });
    }
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        isCurrentMonth: true,
        entries: this.entriesForDate(date, journals)
      });
    }
    // Next month's days to fill last week
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const totalCells = Math.ceil(days.length / 7) * 7;
    for (let i = 1; days.length < totalCells; i++) {
      const date = new Date(nextYear, nextMonth, i);
      days.push({
        date,
        isCurrentMonth: false,
        entries: this.entriesForDate(date, journals)
      });
    }
    return days;
  }

  private entriesForDate(date: Date, journals: Journal[]): Journal[] {
    return journals.filter(journal => {
      const entryDate = new Date(journal.created_at);
      return entryDate.getFullYear() === date.getFullYear() &&
        entryDate.getMonth() === date.getMonth() &&
        entryDate.getDate() === date.getDate();
    });
  }
} 