import {Injectable, Inject} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Journal, JournalStats, NewJournal} from '../models/journal.model';
import {BASE_URL} from '../app.config';

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

  constructor(
    private readonly http: HttpClient,
    @Inject(BASE_URL) private readonly baseUrl: string
  ) { }

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
        'from_date': filter?.fromDate?.toLocaleString() || '',
        'to_date': filter?.toDate?.toLocaleString() || '',
        'search': filter?.search || '',
        'limit': filter?.limit?.toString() || '',
        'offset': filter?.offset?.toString() || '',
        'sort': filter?.sort || '',
        'order': filter?.order || ''
      }
    });
  }
}
