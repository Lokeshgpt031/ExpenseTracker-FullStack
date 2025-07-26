import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../services/analytics.service';
import { AnalyticsData } from '../../models';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="analytics-container">
      <h2 class="mb-4">Financial Analytics</h2>

      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
      </div>

      <div *ngIf="!loading">
        <!-- Summary Cards -->
        <div class="summary-cards">
          <div class="card summary-card">
            <h4>Total Earnings</h4>
            <p class="amount text-success">\${{ analyticsData.totalEarnings.toFixed(2) }}</p>
          </div>
          
          <div class="card summary-card">
            <h4>Total Expenses</h4>
            <p class="amount text-danger">\${{ analyticsData.totalExpenses.toFixed(2) }}</p>
          </div>
          
          <div class="card summary-card">
            <h4>Net Income</h4>
            <p class="amount" [ngClass]="getNetIncomeClass()">
              \${{ analyticsData.netIncome.toFixed(2) }}
            </p>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="charts-section">
          <!-- Expenses by Category -->
          <div class="card">
            <h3>Expenses by Category</h3>
            <div class="chart-container">
              <div *ngIf="hasExpenseData(); else noExpenseData">
                <div *ngFor="let item of getExpenseCategories()" class="chart-bar">
                  <div class="chart-label">{{ item.category }}</div>
                  <div class="chart-bar-container">
                    <div class="chart-bar-fill expense-bar" 
                         [style.width.%]="item.percentage">
                    </div>
                    <span class="chart-value">\${{ item.amount.toFixed(2) }}</span>
                  </div>
                </div>
              </div>
              <ng-template #noExpenseData>
                <p class="text-center">No expense data available</p>
              </ng-template>
            </div>
          </div>

          <!-- Earnings by Source -->
          <div class="card">
            <h3>Earnings by Source</h3>
            <div class="chart-container">
              <div *ngIf="hasEarningData(); else noEarningData">
                <div *ngFor="let item of getEarningSources()" class="chart-bar">
                  <div class="chart-label">{{ item.source }}</div>
                  <div class="chart-bar-container">
                    <div class="chart-bar-fill earning-bar" 
                         [style.width.%]="item.percentage">
                    </div>
                    <span class="chart-value">\${{ item.amount.toFixed(2) }}</span>
                  </div>
                </div>
              </div>
              <ng-template #noEarningData>
                <p class="text-center">No earning data available</p>
              </ng-template>
            </div>
          </div>
        </div>

        <!-- Monthly Trends -->
        <div class="card" *ngIf="analyticsData.monthlyData && analyticsData.monthlyData.length > 0">
          <h3>Monthly Trends</h3>
          <div class="monthly-chart">
            <div *ngFor="let month of analyticsData.monthlyData" class="month-data">
              <h5>{{ month.month }}</h5>
              <div class="month-bars">
                <div class="month-bar">
                  <span class="bar-label">Earnings:</span>
                  <div class="bar-container">
                    <div class="bar earning-bar" [style.width.px]="getBarWidth(month.earnings)"></div>
                    <span class="bar-value">\${{ month.earnings.toFixed(2) }}</span>
                  </div>
                </div>
                <div class="month-bar">
                  <span class="bar-label">Expenses:</span>
                  <div class="bar-container">
                    <div class="bar expense-bar" [style.width.px]="getBarWidth(month.expenses)"></div>
                    <span class="bar-value">\${{ month.expenses.toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .analytics-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .summary-card {
      text-align: center;
      padding: 30px 20px;
    }

    .summary-card h4 {
      margin-bottom: 15px;
      color: #6c757d;
    }

    .amount {
      font-size: 2rem;
      font-weight: bold;
      margin: 0;
    }

    .charts-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 30px;
      margin-bottom: 30px;
    }

    .chart-container {
      margin-top: 20px;
    }

    .chart-bar {
      margin-bottom: 15px;
    }

    .chart-label {
      font-weight: 500;
      margin-bottom: 5px;
    }

    .chart-bar-container {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .chart-bar-fill {
      height: 25px;
      min-width: 20px;
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .expense-bar {
      background-color: #dc3545;
    }

    .earning-bar {
      background-color: #28a745;
    }

    .chart-value {
      font-weight: 500;
      min-width: 80px;
    }

    .monthly-chart {
      margin-top: 20px;
    }

    .month-data {
      margin-bottom: 25px;
      padding-bottom: 20px;
      border-bottom: 1px solid #eee;
    }

    .month-data:last-child {
      border-bottom: none;
    }

    .month-data h5 {
      margin-bottom: 15px;
      color: #495057;
    }

    .month-bars {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .month-bar {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .bar-label {
      min-width: 80px;
      font-weight: 500;
    }

    .bar-container {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
    }

    .bar {
      height: 20px;
      min-width: 10px;
      border-radius: 4px;
    }

    .bar-value {
      font-weight: 500;
      min-width: 80px;
    }
  `]
})
export class AnalyticsComponent implements OnInit {
  analyticsData: AnalyticsData = {
    totalExpenses: 0,
    totalEarnings: 0,
    netIncome: 0,
    expensesByCategory: {},
    earningsBySource: {},
    monthlyData: []
  };
  loading = false;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.loadAnalytics();
  }

  loadAnalytics() {
    this.loading = true;
    this.analyticsService.getAnalytics().subscribe({
      next: (data: any) => {
        this.analyticsData = data;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading analytics:', error);
        this.loading = false;
        // For demo purposes, use mock data if API fails
        this.analyticsData = this.getMockAnalytics();
      }
    });
  }

  getNetIncomeClass(): string {
    return this.analyticsData.netIncome >= 0 ? 'text-success' : 'text-danger';
  }

  hasExpenseData(): boolean {
    return Object.keys(this.analyticsData.expensesByCategory).length > 0;
  }

  hasEarningData(): boolean {
    return Object.keys(this.analyticsData.earningsBySource).length > 0;
  }

  getExpenseCategories() {
    const maxAmount = Math.max(...Object.values(this.analyticsData.expensesByCategory));
    return Object.entries(this.analyticsData.expensesByCategory).map(([category, amount]) => ({
      category,
      amount,
      percentage: maxAmount > 0 ? (amount / maxAmount) * 100 : 0
    }));
  }

  getEarningSources() {
    const maxAmount = Math.max(...Object.values(this.analyticsData.earningsBySource));
    return Object.entries(this.analyticsData.earningsBySource).map(([source, amount]) => ({
      source,
      amount,
      percentage: maxAmount > 0 ? (amount / maxAmount) * 100 : 0
    }));
  }

  getBarWidth(amount: number): number {
    const maxAmount = Math.max(
      ...this.analyticsData.monthlyData.map(m => Math.max(m.earnings, m.expenses))
    );
    return maxAmount > 0 ? (amount / maxAmount) * 200 : 10; // Max width of 200px
  }

  private getMockAnalytics(): AnalyticsData {
    return {
      totalExpenses: 1250.75,
      totalEarnings: 4500.00,
      netIncome: 3249.25,
      expensesByCategory: {
        'Food': 450.25,
        'Transportation': 300.00,
        'Entertainment': 200.50,
        'Utilities': 300.00
      },
      earningsBySource: {
        'Salary': 3500.00,
        'Freelance': 750.00,
        'Investment': 250.00
      },
      monthlyData: [
        { month: 'January 2025', earnings: 4500.00, expenses: 1250.75 },
        { month: 'December 2024', earnings: 4200.00, expenses: 1100.50 },
        { month: 'November 2024', earnings: 4300.00, expenses: 1300.25 }
      ]
    };
  }
}
