import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="hero-section">
      <div class="card">
        <h1 class="text-center mb-4">Welcome to Earning Tracker</h1>
        <p class="text-center mb-4">
          Take control of your finances by tracking your expenses and earnings in one place.
          Get insights into your spending habits and financial trends.
        </p>
        
        <div class="quick-actions">
          <h3 class="mb-3">Quick Actions</h3>
          <div class="d-flex gap-2 justify-content-center">
            <a routerLink="/expenses" class="btn btn-primary">Manage Expenses</a>
            <a routerLink="/earnings" class="btn btn-success">Track Earnings</a>
            <a routerLink="/analytics" class="btn btn-secondary">View Analytics</a>
          </div>
        </div>
      </div>

      <div class="features">
        <div class="card">
          <h3>Features</h3>
          <div class="feature-grid">
            <div class="feature-item">
              <h4>💸 Expense Tracking</h4>
              <p>Keep track of all your expenses with detailed categorization and descriptions.</p>
            </div>
            <div class="feature-item">
              <h4>💰 Earning Management</h4>
              <p>Record your income from various sources and monitor your earning patterns.</p>
            </div>
            <div class="feature-item">
              <h4>📊 Analytics Dashboard</h4>
              <p>Get detailed insights and visualizations of your financial data.</p>
            </div>
            <div class="feature-item">
              <h4>📈 Trends & Reports</h4>
              <p>Analyze your spending habits and income trends over time.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hero-section {
      max-width: 800px;
      margin: 0 auto;
    }

    .quick-actions {
      text-align: center;
      margin-top: 30px;
    }

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .feature-item {
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background-color: #f8f9fa;
    }

    .feature-item h4 {
      margin-bottom: 10px;
      color: #495057;
    }

    .feature-item p {
      color: #6c757d;
      margin: 0;
    }

    .features {
      margin-top: 30px;
    }
  `]
})
export class HomeComponent {

}
