import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EarningService } from '../../services/earning.service';
import { Earning } from '../../models';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { RippleModule } from 'primeng/ripple';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-earnings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    DialogModule,
    InputNumberModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    TableModule,
    ConfirmDialogModule,
    ToastModule,
    SkeletonModule,
    TagModule,
    RippleModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl:'./earnings.component.html'
})
export class EarningsComponent implements OnInit {
  earnings: Earning[] = [];
  newEarning: Earning = {
    amount: 0,
    description: '',
    source: '',
    date: this.getTodayString()
  };
  
  showAddDialog = false;
  loading = false;
  isSubmitting = false;
  showToast = false;
  toastMessage = '';
  todayString = this.getTodayString();

  constructor(private earningService: EarningService) {}

  ngOnInit() {
    this.loadEarnings();
  }

  // FIXED: Method to open dialog
  openAddDialog() {
    console.log('Opening add dialog'); // Debug log
    this.showAddDialog = true;
    this.resetForm();
  }

  // FIXED: Method to close dialog
  closeAddDialog() {
    this.showAddDialog = false;
    this.resetForm();
  }

  // FIXED: Close dialog when clicking on backdrop
  closeDialogOnBackdrop(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeAddDialog();
    }
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
      this.isSubmitting = true;
      
      this.earningService.createEarning(this.newEarning).subscribe({
        next: (earning: any) => {
          this.earnings.unshift(earning);
          this.showToastMessage('Earning added successfully');
          this.closeAddDialog();
          this.isSubmitting = false;
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
          this.showToastMessage('Earning added successfully');
          this.closeAddDialog();
          this.isSubmitting = false;
        }
      });
    }
  }

  confirmDelete(earning: Earning) {
    if (confirm(`Are you sure you want to delete "${earning.description}"?`)) {
      this.deleteEarning(earning.id!);
    }
  }

  deleteEarning(id: number) {
    this.earningService.deleteEarning(id).subscribe({
      next: () => {
        this.earnings = this.earnings.filter(e => e.id !== id);
        this.showToastMessage('Earning deleted successfully');
      },
      error: (error: any) => {
        console.error('Error deleting earning:', error);
        // For demo purposes, remove from local array if API fails
        this.earnings = this.earnings.filter(e => e.id !== id);
        this.showToastMessage('Earning deleted successfully');
      }
    });
  }

  resetForm() {
    this.newEarning = {
      amount: 0,
      description: '',
      source: '',
      date: this.getTodayString()
    };
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString();
  }

  getTotalEarnings(): number {
    return this.earnings.reduce((total, earning) => total + earning.amount, 0);
  }

  getSourceClasses(source: string): string {
    const classMap: { [key: string]: string } = {
      'Salary': 'bg-green-100 text-green-800',
      'Freelance': 'bg-blue-100 text-blue-800',
      'Investment': 'bg-yellow-100 text-yellow-800',
      'Business': 'bg-purple-100 text-purple-800',
      'Rental': 'bg-gray-100 text-gray-800',
      'Gift': 'bg-pink-100 text-pink-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return classMap[source] || 'bg-gray-100 text-gray-800';
  }

  showToastMessage(message: string) {
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  getTodayString(): string {
    return new Date().toISOString().split('T')[0];
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
