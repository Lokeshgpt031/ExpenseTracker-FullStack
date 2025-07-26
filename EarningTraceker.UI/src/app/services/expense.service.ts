import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expense } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl = 'https://localhost:7267/api/expenses'; // Update with your API URL

  constructor(private http: HttpClient) { }

  getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.apiUrl);
  }

  getExpense(id: number): Observable<Expense> {
    return this.http.get<Expense>(`${this.apiUrl}/${id}`);
  }

  createExpense(expense: Expense): Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, expense);
  }

  updateExpense(id: number, expense: Expense): Observable<Expense> {
    return this.http.put<Expense>(`${this.apiUrl}/${id}`, expense);
  }

  deleteExpense(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
