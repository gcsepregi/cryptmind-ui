import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BASE_URL} from '../../app.config';
import {Journal} from '../models/journal';
import {DynamicTableData} from '../models/dynamic-table-data';

@Injectable({
  providedIn: 'root'
})
export class JournalService {

  constructor(private readonly http: HttpClient,
              @Inject(BASE_URL) private readonly baseUrl: string) {
  }

  getEntries(userId: string, pageIndex?: number, pageSize?: number, orderBy?: string, orderDirection?: string) {
    return this.http.get<DynamicTableData<Journal>>(`${this.baseUrl}/admin/users/${userId}/journals`, {
      params: {
        page_index: pageIndex || 0,
        page_size: pageSize || 10,
        order_by: orderBy || 'updated_at',
        order_direction: orderDirection || 'desc'
      }
    });
  }
}
