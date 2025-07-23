import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Journal} from '../models/journal.model';

@Injectable({
  providedIn: 'root'
})
export class JournalsService {

  private readonly baseUrl = 'http://localhost:3000';

  constructor(private readonly http: HttpClient) { }

  getJournals() {
    return this.http.get<Journal[]>(`${this.baseUrl}/journals`);
  }
}
