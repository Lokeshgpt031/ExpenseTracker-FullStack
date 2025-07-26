import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EarningService } from '../../services/earning.service';
import { Earning } from '../../models';

@Component({
  selector: 'app-earnings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="earnings-container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Earning Management</h2>
        <button class="btn btn-success" (click)="showAddForm = !showAddForm">
          {{ showAddForm ? 'Cancel' : 'Add Earning' }}
        </button>
      </div>

      <!-- Add Earning Form -->
      <div class="card" *ngIf="showAddForm">
        <h3>Add New Earning</h3>
        <form (ngSubmit)="addEarning()" #earningForm="ngForm">
          <div class="form-group">
            <label for="amount">Amount</label>
            <input 
              type="number" 
              id="amount"
              class="form-control" 
              [(ngModel)]="newEarning.amount" 
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
              [(ngModel)]="newEarning.description" 
              name="description"
              required>
          </div>
          
          <div class="form-group">
            <label for="source">Source</label>
            <select 
              id="source"
              class="form-control" 
              [(ngModel)]="newEarning.source" 
              name="source"
              required>
              <option value="">Select a source</option>
              <option value="Salary">Salary</option>
              <option value="Freelance">Freelance</option>
              <option value="Investment">Investment</option>
              <option value="Business">Business</option>
              <option value="Rental">Rental</option>
              <option value="Gift">Gift</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="date">Date</label>
            <input 
              type="date" 
              id="date"
              class="form-control" 
              [(ngModel)]="newEarning.date" 
              name="date"
              required>
          </div>
          
          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-success" [disabled]="!earningForm.form.valid">
              Add Earning
            </button>
            <button type="button" class="btn btn-secondary" (click)="resetForm()">
              Reset
            </button>
          </div>
        </form>
      </div>

      <!-- Earnings List -->
      <div class="card">
        <h3>Your Earnings</h3>
        
        <div *ngIf="loading" class="loading">
          <div class="spinner"></div>
        </div>
        
        <div *ngIf="!loading && earnings.length === 0" class="text-center p-4">
          <p>No earnings recorded yet. Add your first earning above!</p>
        </div>
        
        <div *ngIf="!loading && earnings.length > 0">
          <table class="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Source</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let earning of earnings">
                <td>{{ formatDate(earning.date) }}</td>
                <td>{{ earning.description }}</td>
                <td>{{ earning.source }}</td>
                <td class="text-success">\${{ earning.amount.toFixed(2) }}</td>
                <td>
                  <button class="btn btn-sm btn-danger" (click)="deleteEarning(earning.id!)">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div class="mt-3">
            <strong>Total Earnings: <span class="text-success">\${{ getTotalEarnings().toFixed(2) }}</span></strong>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .earnings-container {
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
export class EarningsComponent implements OnInit {
  earnings: Earning[] = [];
  newEarning: Earning = {
    amount: 0,
    description: '',
    source: '',
    date: new Date().toISOString().split('T')[0]
  };
  showAddForm = false;
  loading = false;

  constructor(private earningService: EarningService) {}

  ngOnInit() {
    this.loadEarnings();
  }

  loadEarnings() {
    this.loading = true;
    this.earningService.getEarnings().subscribe({
      next: (earnings: any) => {
        this.earnings = earnings;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading earnings:', error);
        this.loading = false;
        // For demo purposes, use mock data if API fails
        this.earnings = this.getMockEarnings();
      }
    });
  }

  addEarning() {
    if (this.newEarning.amount && this.newEarning.description && this.newEarning.source) {
      this.earningService.createEarning(this.newEarning).subscribe({
        next: (earning: any) => {
          this.earnings.unshift(earning);
          this.resetForm();
          this.showAddForm = false;
        },
        error: (error: any) => {
          console.error('Error adding earning:', error);
          // For demo purposes, add to local array if API fails
          const mockEarning = { 
            ...this.newEarning, 
            id: Date.now(),
            date: this.newEarning.date 
          };
          this.earnings.unshift(mockEarning);
          this.resetForm();
          this.showAddForm = false;
        }
      });
    }
  }

  deleteEarning(id: number) {
    if (confirm('Are you sure you want to delete this earning?')) {
      this.earningService.deleteEarning(id).subscribe({
        next: () => {
          this.earnings = this.earnings.filter(e => e.id !== id);
        },
        error: (error: any) => {
          console.error('Error deleting earning:', error);
          // For demo purposes, remove from local array if API fails
          this.earnings = this.earnings.filter(e => e.id !== id);
        }
      });
    }
  }

  resetForm() {
    this.newEarning = {
      amount: 0,
      description: '',
      source: '',
      date: new Date().toISOString().split('T')[0]
    };
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString();
  }

  getTotalEarnings(): number {
    return this.earnings.reduce((total, earning) => total + earning.amount, 0);
  }

  private getMockEarnings(): Earning[] {
    return [
      {
        id: 1,
        amount: 3000.00,
        description: 'Monthly salary',
        source: 'Salary',
        date: new Date('2025-01-01')
      },
      {
        id: 2,
        amount: 500.00,
        description: 'Freelance project',
        source: 'Freelance',
        date: new Date('2025-01-15')
      },
      {
        id: 3,
        amount: 150.00,
        description: 'Investment dividends',
        source: 'Investment',
        date: new Date('2025-01-20')
      }
    ];
  }
}
