import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardModule,
    ButtonModule,
  ],
  template: `
    <div class="max-w-xl mx-auto px-4 py-8">
      <!-- Welcome Card -->
      <p-card class="mb-8 shadow-sm">
        <ng-template pTemplate="header">
          <h1 class="text-center text-2xl font-bold text-gray-800 mb-2">Welcome to Earning Tracker</h1>
        </ng-template>
        <p class="text-center text-gray-600 mb-6">
          Take control of your finances by tracking your expenses and earnings in one place.<br/>
          Get insights into your spending habits and financial trends.
        </p>
        <div>
          <h3 class="text-lg font-semibold text-gray-700 mb-4 text-center">
            Quick Actions
          </h3>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <a routerLink="/expenses">
              <button pButton type="button" label="Manage Expenses" icon="pi pi-arrow-down-left" class="w-full sm:w-auto" severity="danger"></button>
            </a>
            <a routerLink="/earnings">
              <button pButton type="button" label="Track Earnings" icon="pi pi-arrow-up-right" class="w-full sm:w-auto" severity="success"></button>
            </a>
            <a routerLink="/analytics">
              <button pButton type="button" label="View Analytics" icon="pi pi-chart-line" class="w-full sm:w-auto" severity="info"></button>
            </a>
          </div>
        </div>
      </p-card>

      <!-- Feature List -->
      <p-card>
        <ng-template pTemplate="header">
          <h3 class="text-lg font-semibold text-gray-700">Features</h3>
        </ng-template>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div class="rounded-lg bg-green-50 p-4 flex flex-col items-start">
            <h4 class="text-base font-semibold mb-1">💸 Expense Tracking</h4>
            <p class="text-gray-600 text-sm">Keep track of all your expenses with detailed categorization and descriptions.</p>
          </div>
          <div class="rounded-lg bg-blue-50 p-4 flex flex-col items-start">
            <h4 class="text-base font-semibold mb-1">💰 Earning Management</h4>
            <p class="text-gray-600 text-sm">Record your income from various sources and monitor your earning patterns.</p>
          </div>
          <div class="rounded-lg bg-purple-50 p-4 flex flex-col items-start">
            <h4 class="text-base font-semibold mb-1">📊 Analytics Dashboard</h4>
            <p class="text-gray-600 text-sm">Get detailed insights and visualizations of your financial data.</p>
          </div>
          <div class="rounded-lg bg-yellow-50 p-4 flex flex-col items-start">
            <h4 class="text-base font-semibold mb-1">📈 Trends &amp; Reports</h4>
            <p class="text-gray-600 text-sm">Analyze your spending habits and income trends over time.</p>
          </div>
        </div>
      </p-card>
    </div>
  `
})
export class HomeComponent {}
