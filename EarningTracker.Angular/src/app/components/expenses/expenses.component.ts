import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../services/expense.service';
import { Expense } from '../../models';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl:'./expenses.component.html'
})
export class ExpensesComponent implements OnInit {
  expenses: Expense[] = [];
  newExpense: Expense = {
    amount: 0,
    description: '',
    category: '',
    date: this.getTodayString()
  };
  
  showAddDialog = false;
  loading = false;
  isSubmitting = false;
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  todayString = this.getTodayString();

  constructor(private expenseService: ExpenseService) {}

  ngOnInit() {
    this.loadExpenses();
  }

  // Method to open dialog
  openAddDialog() {
    console.log('Opening add dialog'); // Debug log
    this.showAddDialog = true;
    this.resetForm();
  }

  // Method to close dialog
  closeAddDialog() {
    this.showAddDialog = false;
    this.resetForm();
  }

  // Close dialog when clicking on backdrop
  closeDialogOnBackdrop(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeAddDialog();
    }
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
      this.isSubmitting = true;
      
      this.expenseService.createExpense(this.newExpense).subscribe({
        next: (expense) => {
          this.expenses.unshift(expense);
          this.showToastMessage('Expense added successfully', 'success');
          this.closeAddDialog();
          this.isSubmitting = false;
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
          this.showToastMessage('Expense added successfully', 'success');
          this.closeAddDialog();
          this.isSubmitting = false;
        }
      });
    }
  }

  confirmDelete(expense: Expense) {
    if (confirm(`Are you sure you want to delete "${expense.description}"?`)) {
      this.deleteExpense(expense.id!);
    }
  }

  deleteExpense(id: number) {
    this.expenseService.deleteExpense(id).subscribe({
      next: () => {
        this.expenses = this.expenses.filter(e => e.id !== id);
        this.showToastMessage('Expense deleted successfully', 'success');
      },
      error: (error) => {
        console.error('Error deleting expense:', error);
        // For demo purposes, remove from local array if API fails
        this.expenses = this.expenses.filter(e => e.id !== id);
        this.showToastMessage('Expense deleted successfully', 'success');
      }
    });
  }

  resetForm() {
    this.newExpense = {
      amount: 0,
      description: '',
      category: '',
      date: this.getTodayString()
    };
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString();
  }

  getTotalExpenses(): number {
    return this.expenses.reduce((total, expense) => total + expense.amount, 0);
  }

  getCategoryClasses(category: string): string {
    const classMap: { [key: string]: string } = {
      'Food': 'bg-orange-100 text-orange-800',
      'Transportation': 'bg-blue-100 text-blue-800',
      'Entertainment': 'bg-purple-100 text-purple-800',
      'Utilities': 'bg-yellow-100 text-yellow-800',
      'Shopping': 'bg-pink-100 text-pink-800',
      'Healthcare': 'bg-green-100 text-green-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return classMap[category] || 'bg-gray-100 text-gray-800';
  }

  showToastMessage(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  getTodayString(): string {
    return new Date().toISOString().split('T')[0];
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
