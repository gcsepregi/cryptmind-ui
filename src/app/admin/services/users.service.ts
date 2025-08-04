import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BASE_URL} from '../../app.config';
import {User, UserSessions} from '../models/user';
import {DynamicTableData} from '../models/dynamic-table-data';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private readonly http: HttpClient,
              @Inject(BASE_URL) private readonly baseUrl: string) {
  }

  getUsers(pageIndex?: number, pageSize?: number, orderBy?: string, orderDirection?: string) {
    return this.http.get<DynamicTableData<User>>(`${this.baseUrl}/admin/users`, {
      params: {
        page_index: pageIndex || 0,
        page_size: pageSize || 10,
        order_by: orderBy || 'email',
        order_direction: orderDirection || 'asc'
      }
    });
  }

  getSessions(userId: string, pageIndex?: number, pageSize?: number) {
    return this.http.get<UserSessions>(`${this.baseUrl}/admin/users/${userId}/sessions`, {
      params: {
        page_index: pageIndex || 0,
        page_size: pageSize || 10
      }
    });
  }

  deleteSession(userId: string, jti: string) {
    return this.http.delete(`${this.baseUrl}/admin/users/${userId}/sessions/${jti}`);
  }
}
