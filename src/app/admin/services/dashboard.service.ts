import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BASE_URL} from '../../app.config';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private readonly http: HttpClient,
              @Inject(BASE_URL) private readonly baseUrl: string ) {
  }

  getStats() {
    return this.http.get<any>(`${this.baseUrl}/admin/dashboard`);
  }

}
