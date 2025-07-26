import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { EarningsComponent } from './components/earnings/earnings.component';
import { ExpensesComponent } from './components/expenses/expenses.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { authGuard } from './guards/auth.guard';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
  { 
    path: 'register', 
    component: RegisterComponent 
  },
  // Public routes (no auth required)
  { 
    path: 'login', 
    component: LoginComponent 
  },
  
  // Protected routes (auth required)
  { 
    path: '', 
    component: HomeComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'earnings', 
    component: EarningsComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'expenses', 
    component: ExpensesComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'analytics', 
    component: AnalyticsComponent, 
    canActivate: [authGuard] 
  },
  
  // Catch all route
  { 
    path: '**', 
    redirectTo: '' 
  }
];
