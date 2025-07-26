import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateEarningRequest, EarningFilters, EarningResponse, SourceInfo } from '../models';
import { environment } from '../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class EarningService {
  private apiUrl = `${environment.apiUrl}/earnings`;

  constructor(private http: HttpClient) {}

  /**
   * Get all earnings
   * Matches: GetEarnings()
   */
  getEarnings(filters?: EarningFilters): Observable<EarningResponse[]> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = (filters as any)[key];
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<EarningResponse[]>(this.apiUrl, { params });
  }

  /**
   * Get a specific earning by ID
   * Matches: GetEarning(int id)
   */
  getEarning(id: number): Observable<EarningResponse> {
    return this.http.get<EarningResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new earning
   * Matches: CreateEarning(CreateEarningRequest request)
   */
  createEarning(earning: CreateEarningRequest): Observable<EarningResponse> {
    return this.http.post<EarningResponse>(this.apiUrl, earning);
  }

  /**
   * Update an existing earning
   * Matches: UpdateEarning(int id, CreateEarningRequest request)
   */
  updateEarning(id: number, earning: CreateEarningRequest): Observable<EarningResponse> {
    return this.http.put<EarningResponse>(`${this.apiUrl}/${id}`, earning);
  }

  /**
   * Delete an earning
   * Matches: DeleteEarning(int id)
   */
  deleteEarning(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get valid sources for earnings
   * Matches: GetValidSources()
   */
  getValidSources(): Observable<SourceInfo[]> {
    return this.http.get<SourceInfo[]>(`${this.apiUrl}/sources`);
  }

  // Utility methods for your existing components
  
  /**
   * Get earnings with date range filter
   */
  getEarningsByDateRange(startDate: Date, endDate: Date): Observable<EarningResponse[]> {
    const params = new HttpParams()
      .set('startDate', startDate.toISOString().split('T')[0])
      .set('endDate', endDate.toISOString().split('T')[0]);
    
    return this.http.get<EarningResponse[]>(this.apiUrl, { params });
  }

  /**
   * Get earnings by source
   */
  getEarningsBySource(sourceId: number): Observable<EarningResponse[]> {
    const params = new HttpParams().set('sourceId', sourceId.toString());
    return this.http.get<EarningResponse[]>(this.apiUrl, { params });
  }

  /**
   * Get total earnings amount
   */
  getTotalEarnings(): Observable<number> {
    return new Observable(observer => {
      this.getEarnings().subscribe({
        next: (earnings) => {
          const total = earnings.reduce((sum, earning) => sum + earning.amount, 0);
          observer.next(total);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }
}
