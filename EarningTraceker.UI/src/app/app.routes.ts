import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ExpensesComponent } from './components/expenses/expenses.component';
import { EarningsComponent } from './components/earnings/earnings.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'expenses', component: ExpensesComponent },
  { path: 'earnings', component: EarningsComponent },
  { path: 'analytics', component: AnalyticsComponent },
  { path: '**', redirectTo: '' }
];
