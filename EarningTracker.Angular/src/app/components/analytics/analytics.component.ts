import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../services/analytics.service';
import { AnalyticsData } from '../../models';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';
import { DividerModule } from 'primeng/divider';
import { BadgeModule } from 'primeng/badge';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ProgressBarModule,
    SkeletonModule,
    DividerModule,
    BadgeModule,
    TagModule
  ],
  template: `
    <div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Financial Analytics
          </h1>
          <p class="text-gray-600 text-sm sm:text-base">
            Track your income and expenses
          </p>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <p-card *ngFor="let item of [1,2,3]" class="h-32">
              <p-skeleton height="2rem" class="mb-2"></p-skeleton>
              <p-skeleton height="3rem"></p-skeleton>
            </p-card>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <p-card *ngFor="let item of [1,2]" class="h-64">
              <p-skeleton height="1.5rem" class="mb-4"></p-skeleton>
              <p-skeleton height="1rem" class="mb-2" *ngFor="let line of [1,2,3,4]"></p-skeleton>
            </p-card>
          </div>
        </div>

        <!-- Content -->
        <div *ngIf="!loading" class="space-y-6">
          <!-- Summary Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Total Earnings -->
            <p-card class="text-center hover:shadow-lg transition-shadow duration-200">
              <div class="p-2">
                <div class="flex items-center justify-center mb-3">
                  <i class="pi pi-arrow-up text-green-500 text-xl mr-2"></i>
                  <h3 class="text-sm sm:text-base font-medium text-gray-600">Total Earnings</h3>
                </div>
                <p class="text-2xl sm:text-3xl font-bold text-green-600">
                  \${{ analyticsData.totalEarnings.toFixed(2) }}
                </p>
              </div>
            </p-card>

            <!-- Total Expenses -->
            <p-card class="text-center hover:shadow-lg transition-shadow duration-200">
              <div class="p-2">
                <div class="flex items-center justify-center mb-3">
                  <i class="pi pi-arrow-down text-red-500 text-xl mr-2"></i>
                  <h3 class="text-sm sm:text-base font-medium text-gray-600">Total Expenses</h3>
                </div>
                <p class="text-2xl sm:text-3xl font-bold text-red-600">
                  \${{ analyticsData.totalExpenses.toFixed(2) }}
                </p>
              </div>
            </p-card>

            <!-- Net Income -->
            <p-card class="text-center hover:shadow-lg transition-shadow duration-200 sm:col-span-2 lg:col-span-1">
              <div class="p-2">
                <div class="flex items-center justify-center mb-3">
                  <i class="pi pi-wallet text-blue-500 text-xl mr-2"></i>
                  <h3 class="text-sm sm:text-base font-medium text-gray-600">Net Income</h3>
                </div>
                <p class="text-2xl sm:text-3xl font-bold" 
                   [ngClass]="analyticsData.netIncome >= 0 ? 'text-green-600' : 'text-red-600'">
                  \${{ analyticsData.netIncome.toFixed(2) }}
                </p>
                <p-tag 
                  [value]="analyticsData.netIncome >= 0 ? 'Profit' : 'Loss'"
                  [severity]="analyticsData.netIncome >= 0 ? 'success' : 'danger'"
                  class="mt-2">
                </p-tag>
              </div>
            </p-card>
          </div>

          <!-- Charts Section -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Expenses by Category -->
            <p-card>
              <ng-template pTemplate="header">
                <div class="flex items-center p-4 pb-0">
                  <i class="pi pi-chart-pie text-red-500 mr-3"></i>
                  <h2 class="text-lg sm:text-xl font-semibold text-gray-800">Expenses by Category</h2>
                </div>
              </ng-template>
              
              <div class="p-4">
                <div *ngIf="hasExpenseData(); else noExpenseData" class="space-y-4">
                  <div *ngFor="let item of getExpenseCategories()" 
                       class="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                    <div class="flex justify-between items-center mb-2">
                      <span class="font-medium text-gray-700 text-sm sm:text-base">{{ item.category }}</span>
                      <span class="font-bold text-red-600 text-sm sm:text-base">
                        \${{ item.amount.toFixed(2) }}
                      </span>
                    </div>
                    <p-progressBar 
                      [value]="item.percentage" 
                      [showValue]="false"
                      styleClass="h-2">
                    </p-progressBar>
                    <div class="text-xs text-gray-500 mt-1 text-right">
                      {{ item.percentage.toFixed(1) }}%
                    </div>
                  </div>
                </div>
                <ng-template #noExpenseData>
                  <div class="text-center py-8">
                    <i class="pi pi-exclamation-circle text-gray-400 text-3xl mb-3"></i>
                    <p class="text-gray-500">No expense data available</p>
                  </div>
                </ng-template>
              </div>
            </p-card>

            <!-- Earnings by Source -->
            <p-card>
              <ng-template pTemplate="header">
                <div class="flex items-center p-4 pb-0">
                  <i class="pi pi-chart-bar text-green-500 mr-3"></i>
                  <h2 class="text-lg sm:text-xl font-semibold text-gray-800">Earnings by Source</h2>
                </div>
              </ng-template>
              
              <div class="p-4">
                <div *ngIf="hasEarningData(); else noEarningData" class="space-y-4">
                  <div *ngFor="let item of getEarningSources()" 
                       class="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                    <div class="flex justify-between items-center mb-2">
                      <span class="font-medium text-gray-700 text-sm sm:text-base">{{ item.source }}</span>
                      <span class="font-bold text-green-600 text-sm sm:text-base">
                        \${{ item.amount.toFixed(2) }}
                      </span>
                    </div>
                    <p-progressBar 
                      [value]="item.percentage" 
                      [showValue]="false"
                      styleClass="h-2">
                    </p-progressBar>
                    <div class="text-xs text-gray-500 mt-1 text-right">
                      {{ item.percentage.toFixed(1) }}%
                    </div>
                  </div>
                </div>
                <ng-template #noEarningData>
                  <div class="text-center py-8">
                    <i class="pi pi-exclamation-circle text-gray-400 text-3xl mb-3"></i>
                    <p class="text-gray-500">No earning data available</p>
                  </div>
                </ng-template>
              </div>
            </p-card>
          </div>

          <!-- Monthly Trends -->
          <p-card *ngIf="analyticsData.monthlyData && analyticsData.monthlyData.length > 0">
            <ng-template pTemplate="header">
              <div class="flex items-center p-4 pb-0">
                <i class="pi pi-calendar text-blue-500 mr-3"></i>
                <h2 class="text-lg sm:text-xl font-semibold text-gray-800">Monthly Trends</h2>
              </div>
            </ng-template>
            
            <div class="p-4">
              <div class="space-y-6">
                <div *ngFor="let month of analyticsData.monthlyData; let last = last" 
                     class="pb-6" 
                     [class.border-b]="!last" 
                     [class.border-gray-200]="!last">
                  <h3 class="text-base sm:text-lg font-semibold text-gray-700 mb-4">
                    {{ month.month }}
                  </h3>
                  
                  <div class="space-y-4">
                    <!-- Earnings Bar -->
                    <div class="bg-green-50 rounded-lg p-3">
                      <div class="flex justify-between items-center mb-2">
                        <div class="flex items-center">
                          <i class="pi pi-arrow-up text-green-500 mr-2"></i>
                          <span class="font-medium text-green-700 text-sm sm:text-base">Earnings</span>
                        </div>
                        <span class="font-bold text-green-600 text-sm sm:text-base">
                          \${{ month.earnings.toFixed(2) }}
                        </span>
                      </div>
                      <div class="bg-green-200 rounded-full h-2">
                        <div class="bg-green-500 h-2 rounded-full transition-all duration-500" 
                             [style.width.%]="getMonthlyPercentage(month.earnings)">
                        </div>
                      </div>
                    </div>

                    <!-- Expenses Bar -->
                    <div class="bg-red-50 rounded-lg p-3">
                      <div class="flex justify-between items-center mb-2">
                        <div class="flex items-center">
                          <i class="pi pi-arrow-down text-red-500 mr-2"></i>
                          <span class="font-medium text-red-700 text-sm sm:text-base">Expenses</span>
                        </div>
                        <span class="font-bold text-red-600 text-sm sm:text-base">
                          \${{ month.expenses.toFixed(2) }}
                        </span>
                      </div>
                      <div class="bg-red-200 rounded-full h-2">
                        <div class="bg-red-500 h-2 rounded-full transition-all duration-500" 
                             [style.width.%]="getMonthlyPercentage(month.expenses)">
                        </div>
                      </div>
                    </div>

                    <!-- Net for this month -->
                    <div class="flex justify-between items-center text-sm bg-gray-100 rounded-lg p-2">
                      <span class="font-medium text-gray-600">Net Income:</span>
                      <span class="font-bold" 
                            [ngClass]="(month.earnings - month.expenses) >= 0 ? 'text-green-600' : 'text-red-600'">
                        \${{ (month.earnings - month.expenses).toFixed(2) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </p-card>
        </div>
      </div>
    </div>
  `
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

  getMonthlyPercentage(amount: number): number {
    if (!this.analyticsData.monthlyData.length) return 0;
    const maxAmount = Math.max(
      ...this.analyticsData.monthlyData.map(m => Math.max(m.earnings, m.expenses))
    );
    return maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
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
