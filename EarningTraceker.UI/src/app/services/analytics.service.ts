import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnalyticsData } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = 'https://localhost:7267/api/analytics'; // Update with your API URL

  constructor(private http: HttpClient) { }

  getAnalytics(): Observable<AnalyticsData> {
    return this.http.get<AnalyticsData>(this.apiUrl);
  }

  getMonthlyAnalytics(year: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/monthly/${year}`);
  }

  getCategoryAnalytics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories`);
  }
}
