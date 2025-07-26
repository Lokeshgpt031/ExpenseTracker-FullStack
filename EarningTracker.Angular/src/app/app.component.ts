import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

// PrimeNG imports
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { RippleModule } from 'primeng/ripple';
import { BadgeModule } from 'primeng/badge';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MenubarModule,
    ButtonModule,
    SidebarModule,
    RippleModule,
    BadgeModule
  ],
  templateUrl:  "./app.component.html"
})
export class AppComponent implements OnInit {
  title = 'earning-tracker-ui';
  sidebarVisible = false;
  currentRoute = '';

  navItems = [
    {
      label: 'Dashboard',
      shortLabel: 'Home',
      route: '/',
      icon: 'pi pi-home',
      exact: true
    },
    {
      label: 'Expenses',
      route: '/expenses',
      icon: 'pi pi-arrow-down-left',
      exact: false
    },
    {
      label: 'Earnings',
      route: '/earnings',
      icon: 'pi pi-arrow-up-right',
      exact: false
    },
    {
      label: 'Analytics',
      route: '/analytics',
      icon: 'pi pi-chart-line',
      exact: false,
      badge: 'New'
    }
  ];

  constructor(private router: Router, public authService: AuthService) { }

  ngOnInit() {
    // Track current route for breadcrumbs
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.urlAfterRedirects;
      });
  }

  getCurrentPageTitle(): string {
    const currentItem = this.navItems.find(item =>
      item.exact ? item.route === this.currentRoute : this.currentRoute.startsWith(item.route)
    );
    return currentItem?.label || 'Dashboard';
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
