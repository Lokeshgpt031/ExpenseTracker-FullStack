import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../services/expense.service';
import { Expense } from '../../models';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="expenses-container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Expense Management</h2>
        <button class="btn btn-primary" (click)="showAddForm = !showAddForm">
          {{ showAddForm ? 'Cancel' : 'Add Expense' }}
        </button>
      </div>

      <!-- Add Expense Form -->
      <div class="card" *ngIf="showAddForm">
        <h3>Add New Expense</h3>
        <form (ngSubmit)="addExpense()" #expenseForm="ngForm">
          <div class="form-group">
            <label for="amount">Amount</label>
            <input 
              type="number" 
              id="amount"
              class="form-control" 
              [(ngModel)]="newExpense.amount" 
              name="amount"
              step="0.01"
              required>
          </div>
          
          <div class="form-group">
            <label for="description">Description</label>
            <input 
              type="text" 
              id="description"
              class="form-control" 
              [(ngModel)]="newExpense.description" 
              name="description"
              required>
          </div>
          
          <div class="form-group">
            <label for="category">Category</label>
            <select 
              id="category"
              class="form-control" 
              [(ngModel)]="newExpense.category" 
              name="category"
              required>
              <option value="">Select a category</option>
              <option value="Food">Food</option>
              <option value="Transportation">Transportation</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Utilities">Utilities</option>
              <option value="Shopping">Shopping</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="date">Date</label>
            <input 
              type="date" 
              id="date"
              class="form-control" 
              [(ngModel)]="newExpense.date" 
              name="date"
              required>
          </div>
          
          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-success" [disabled]="!expenseForm.form.valid">
              Add Expense
            </button>
            <button type="button" class="btn btn-secondary" (click)="resetForm()">
              Reset
            </button>
          </div>
        </form>
      </div>

      <!-- Expenses List -->
      <div class="card">
        <h3>Your Expenses</h3>
        
        <div *ngIf="loading" class="loading">
          <div class="spinner"></div>
        </div>
        
        <div *ngIf="!loading && expenses.length === 0" class="text-center p-4">
          <p>No expenses recorded yet. Add your first expense above!</p>
        </div>
        
        <div *ngIf="!loading && expenses.length > 0">
          <table class="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let expense of expenses">
                <td>{{ formatDate(expense.date) }}</td>
                <td>{{ expense.description }}</td>
                <td>{{ expense.category }}</td>
                <td class="text-danger">\${{ expense.amount.toFixed(2) }}</td>
                <td>
                  <button class="btn btn-sm btn-danger" (click)="deleteExpense(expense.id!)">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div class="mt-3">
            <strong>Total Expenses: <span class="text-danger">\${{ getTotalExpenses().toFixed(2) }}</span></strong>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .expenses-container {
      max-width: 1000px;
      margin: 0 auto;
    }

    .table th {
      background-color: #f8f9fa;
    }

    .btn-sm {
      padding: 4px 8px;
      font-size: 12px;
    }
  `]
})
export class ExpensesComponent implements OnInit {
  expenses: Expense[] = [];
  newExpense: Expense = {
    amount: 0,
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  };
  showAddForm = false;
  loading = false;

  constructor(private expenseService: ExpenseService) {}

  ngOnInit() {
    this.loadExpenses();
  }

  loadExpenses() {
    this.loading = true;
    this.expenseService.getExpenses().subscribe({
      next: (expenses) => {
        this.expenses = expenses;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading expenses:', error);
        this.loading = false;
        // For demo purposes, use mock data if API fails
        this.expenses = this.getMockExpenses();
      }
    });
  }

  addExpense() {
    if (this.newExpense.amount && this.newExpense.description && this.newExpense.category) {
      this.expenseService.createExpense(this.newExpense).subscribe({
        next: (expense) => {
          this.expenses.unshift(expense);
          this.resetForm();
          this.showAddForm = false;
        },
        error: (error) => {
          console.error('Error adding expense:', error);
          // For demo purposes, add to local array if API fails
          const mockExpense = { 
            ...this.newExpense, 
            id: Date.now(),
            date: this.newExpense.date 
          };
          this.expenses.unshift(mockExpense);
          this.resetForm();
          this.showAddForm = false;
        }
      });
    }
  }

  deleteExpense(id: number) {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.expenseService.deleteExpense(id).subscribe({
        next: () => {
          this.expenses = this.expenses.filter(e => e.id !== id);
        },
        error: (error) => {
          console.error('Error deleting expense:', error);
          // For demo purposes, remove from local array if API fails
          this.expenses = this.expenses.filter(e => e.id !== id);
        }
      });
    }
  }

  resetForm() {
    this.newExpense = {
      amount: 0,
      description: '',
      category: '',
      date: new Date().toISOString().split('T')[0]
    };
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString();
  }

  getTotalExpenses(): number {
    return this.expenses.reduce((total, expense) => total + expense.amount, 0);
  }

  private getMockExpenses(): Expense[] {
    return [
      {
        id: 1,
        amount: 25.50,
        description: 'Lunch at restaurant',
        category: 'Food',
        date: new Date('2025-01-20')
      },
      {
        id: 2,
        amount: 60.00,
        description: 'Gas for car',
        category: 'Transportation',
        date: new Date('2025-01-19')
      },
      {
        id: 3,
        amount: 15.99,
        description: 'Netflix subscription',
        category: 'Entertainment',
        date: new Date('2025-01-18')
      }
    ];
  }
}
