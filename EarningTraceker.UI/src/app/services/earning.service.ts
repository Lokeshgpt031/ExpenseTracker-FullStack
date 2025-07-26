import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Earning } from '../models';

@Injectable({
  providedIn: 'root'
})
export class EarningService {
  private apiUrl = 'https://localhost:7267/api/earnings'; // Update with your API URL

  constructor(private http: HttpClient) { }

  getEarnings(): Observable<Earning[]> {
    return this.http.get<Earning[]>(this.apiUrl);
  }

  getEarning(id: number): Observable<Earning> {
    return this.http.get<Earning>(`${this.apiUrl}/${id}`);
  }

  createEarning(earning: Earning): Observable<Earning> {
    return this.http.post<Earning>(this.apiUrl, earning);
  }

  updateEarning(id: number, earning: Earning): Observable<Earning> {
    return this.http.put<Earning>(`${this.apiUrl}/${id}`, earning);
  }

  deleteEarning(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
