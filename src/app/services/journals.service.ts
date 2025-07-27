import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Journal, JournalStats, NewJournal} from '../models/journal.model';

export interface JournalFilter {
  type?: string;
  fromDate?: Date;
  toDate?: Date;
  search?: string;
  limit?: number;
  offset?: number;
  sort?: "asc" | "desc";
  order?: "date" | "title" | "tag";
}

@Injectable({
  providedIn: 'root'
})
export class JournalsService {

  private readonly baseUrl = 'http://localhost:3000';

  constructor(private readonly http: HttpClient) { }

  getJournals(filter?: JournalFilter) {
    const params = this.toParams(filter);
    console.log(params);
    return this.http.get<Journal[]>(`${this.baseUrl}/journals`, {
      params: params
    });
  }

  getJournalEntry(id: string, journal_type: "diary" | "dream" | "ritual" | "divination") {
    return this.http.get<Journal>(`${this.baseUrl}/journals/${journal_type}/${id}`);
  }

  createJournalEntry(entry: NewJournal) {
    return this.http.post(`${this.baseUrl}/journals/${entry.journal_type}/`, {journal_entry: entry});
  }

  updateJournalEntry(id: string, journal_type: "diary" | "dream" | "ritual" | "divination", entry: Partial<NewJournal>) {
    return this.http.patch(`${this.baseUrl}/journals/${journal_type}/${id}`, {journal_entry: entry});
  }

  deleteJournalEntry(id: string, journal_type: "diary" | "dream" | "ritual" | "divination") {
    return this.http.delete(`${this.baseUrl}/journals/${journal_type}/${id}`);
  }

  getRecents() {
    return this.http.get<Journal[]>(`${this.baseUrl}/journals/recents`);
  }

  getStats() {
    return this.http.get<JournalStats>(`${this.baseUrl}/journals/stats`);
  }

  private toParams(filter?: JournalFilter): HttpParams {
    return new HttpParams({
      fromObject: {
        'type': filter?.type || '',
        'from_date': filter?.fromDate?.toISOString() || '',
        'to_date': filter?.toDate?.toISOString() || '',
        'search': filter?.search || '',
        'limit': filter?.limit?.toString() || '',
        'offset': filter?.offset?.toString() || '',
        'sort': filter?.sort || '',
        'order': filter?.order || ''
      }
    });
  }
}
