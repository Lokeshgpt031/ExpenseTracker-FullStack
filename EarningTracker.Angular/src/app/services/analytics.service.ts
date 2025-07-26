import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnalyticsData } from '../models';
import { environment } from '../../environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private url=environment.apiUrl
  private analyticUrl = `${this.url}/analytics`; // Update with your API URL

  constructor(private http: HttpClient) { }

  getAnalytics(): Observable<AnalyticsData> {
    return this.http.get<AnalyticsData>(this.analyticUrl);
  }

  getMonthlyAnalytics(year: number): Observable<any> {
    return this.http.get(`${this.analyticUrl}/monthly/${year}`);
  }

  getCategoryAnalytics(): Observable<any> {
    return this.http.get(`${this.analyticUrl}/categories`);
  }
}
