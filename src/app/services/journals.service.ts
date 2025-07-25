import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Journal, NewJournal} from '../models/journal.model';

@Injectable({
  providedIn: 'root'
})
export class JournalsService {

  private readonly baseUrl = 'http://localhost:3000';

  constructor(private readonly http: HttpClient) { }

  getJournals() {
    return this.http.get<Journal[]>(`${this.baseUrl}/journals`);
  }

  createJournalEntry(entry: NewJournal) {
    return this.http.post(`${this.baseUrl}/journals/${entry.journal_type}/`, {journal_entry: entry});
  }

  deleteJournalEntry(id: string, journal_type: "diary" | "dream" | "ritual" | "divination") {
    return this.http.delete(`${this.baseUrl}/journals/${journal_type}/${id}`);
  }
}
