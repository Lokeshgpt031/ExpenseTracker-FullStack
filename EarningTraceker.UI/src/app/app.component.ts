import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center w-100">
          <a routerLink="/" class="navbar-brand">💰 Earning Tracker</a>
          <ul class="navbar-nav">
            <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">Home</a></li>
            <li><a routerLink="/expenses" routerLinkActive="active" class="nav-link">Expenses</a></li>
            <li><a routerLink="/earnings" routerLinkActive="active" class="nav-link">Earnings</a></li>
            <li><a routerLink="/analytics" routerLinkActive="active" class="nav-link">Analytics</a></li>
          </ul>
        </div>
      </div>
    </nav>
    
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .navbar {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .navbar-nav {
      margin: 0;
    }
    
    .navbar-nav li {
      list-style: none;
    }
  `]
})
export class AppComponent {
  title = 'earning-tracker-ui';
}
