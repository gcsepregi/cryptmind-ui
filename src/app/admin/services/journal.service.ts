import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BASE_URL} from '../../app.config';
import {Journal} from '../models/journal';

@Injectable({
  providedIn: 'root'
})
export class JournalService {

  constructor(private readonly http: HttpClient,
              @Inject(BASE_URL) private readonly baseUrl: string) {
  }

  getEntries(userId: string) {
    return this.http.get<Journal[]>(`${this.baseUrl}/admin/users/${userId}/journals`);
  }
}
