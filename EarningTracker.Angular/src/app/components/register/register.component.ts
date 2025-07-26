import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div class="max-w-md w-full">
        <!-- Logo/Brand -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
            <span class="text-2xl text-white">💰</span>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Join Earning Tracker</h1>
          <p class="text-gray-600">Create your account to start tracking</p>
        </div>

        <!-- Register Form Card -->
        <div class="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <!-- Error Message -->
          <div *ngIf="errorMessage" 
               class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-red-700 text-sm">{{ errorMessage }}</span>
            </div>
          </div>

          <!-- Success Message -->
          <div *ngIf="successMessage" 
               class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-green-700 text-sm">{{ successMessage }}</span>
            </div>
          </div>

          <form (ngSubmit)="onRegister()" #registerForm="ngForm" class="space-y-4">
            <!-- Name Field -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <input 
                  type="text"
                  id="name"
                  [(ngModel)]="registerData.name"
                  name="name"
                  placeholder="Enter your full name"
                  class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base"
                  required
                  minlength="2">
              </div>
            </div>

            <!-- Email Field -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 00-7 7v4h8a3 3 0 003-3V9a5 5 0 00-10 0v3"></path>
                  </svg>
                </div>
                <input 
                  type="email"
                  id="email"
                  [(ngModel)]="registerData.email"
                  name="email"
                  placeholder="Enter your email"
                  class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base"
                  required
                  email>
              </div>
            </div>

            <!-- Phone Number Field -->
            <div>
              <label for="phoneNumber" class="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </div>
                <input 
                  type="tel"
                  id="phoneNumber"
                  [(ngModel)]="registerData.phoneNumber"
                  name="phoneNumber"
                  placeholder="Enter your phone number"
                  class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base"
                  required
                  pattern="[0-9+\-\s\(\)]+">
              </div>
            </div>

            <!-- Profession Field -->
            <div>
              <label for="profession" class="block text-sm font-medium text-gray-700 mb-2">
                Profession *
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V4a2 2 0 00-2 2h-4a2 2 0 00-2-2v2m8 0h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2"></path>
                  </svg>
                </div>
                <select 
                  id="profession"
                  [(ngModel)]="registerData.profession"
                  name="profession"
                  class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base bg-white"
                  required>
                  <option value="">Select your profession</option>
                  <option value="Software Developer">💻 Software Developer</option>
                  <option value="Designer">🎨 Designer</option>
                  <option value="Marketing">📢 Marketing</option>
                  <option value="Sales">💼 Sales</option>
                  <option value="Teacher">👩‍🏫 Teacher</option>
                  <option value="Healthcare">🏥 Healthcare</option>
                  <option value="Finance">💰 Finance</option>
                  <option value="Engineering">⚙️ Engineering</option>
                  <option value="Student">📚 Student</option>
                  <option value="Freelancer">🏠 Freelancer</option>
                  <option value="Business Owner">🏢 Business Owner</option>
                  <option value="Other">📦 Other</option>
                </select>
              </div>
            </div>

            <!-- Password Field -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <input 
                  [type]="showPassword ? 'text' : 'password'"
                  id="password"
                  [(ngModel)]="registerData.password"
                  name="password"
                  placeholder="Create a strong password"
                  class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base"
                  required
                  minlength="6">
                <button 
                  type="button"
                  (click)="togglePasswordVisibility()"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                  <svg *ngIf="!showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  <svg *ngIf="showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M14.121 14.121l1.415 1.415"></path>
                  </svg>
                </button>
              </div>
              <!-- Password Strength Indicator -->
              <div class="mt-2">
                <div class="flex space-x-1">
                  <div class="h-1 flex-1 rounded" 
                       [ngClass]="getPasswordStrengthClass(0)"></div>
                  <div class="h-1 flex-1 rounded" 
                       [ngClass]="getPasswordStrengthClass(1)"></div>
                  <div class="h-1 flex-1 rounded" 
                       [ngClass]="getPasswordStrengthClass(2)"></div>
                  <div class="h-1 flex-1 rounded" 
                       [ngClass]="getPasswordStrengthClass(3)"></div>
                </div>
                <p class="text-xs text-gray-500 mt-1">
                  {{ getPasswordStrengthText() }}
                </p>
              </div>
            </div>

            <!-- Terms and Conditions -->
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input 
                  type="checkbox" 
                  id="terms"
                  [(ngModel)]="acceptTerms"
                  name="terms"
                  class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  required>
              </div>
              <div class="ml-3 text-sm">
                <label for="terms" class="font-medium text-gray-700">
                  I agree to the 
                  <a href="#" class="text-green-600 hover:text-green-500 underline">Terms of Service</a>
                  and 
                  <a href="#" class="text-green-600 hover:text-green-500 underline">Privacy Policy</a>
                </label>
              </div>
            </div>

            <!-- Register Button -->
            <button 
              type="submit"
              [disabled]="!registerForm.form.valid || !acceptTerms || isLoading"
              class="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 text-base">
              <div *ngIf="isLoading" class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <svg *ngIf="!isLoading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
              <span>{{ isLoading ? 'Creating Account...' : 'Create Account' }}</span>
            </button>
          </form>

          <!-- Divider -->
          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>
          </div>

          <!-- Login Link -->
          <div class="mt-6 text-center">
            <a routerLink="/login" 
               class="text-green-600 hover:text-green-500 font-medium text-sm">
              Sign in to your account
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center mt-8 text-sm text-gray-500">
          <p>© 2025 Earning Tracker. All rights reserved.</p>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div *ngIf="isLoading" 
         class="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 flex items-center space-x-3">
        <div class="animate-spin rounded-full h-6 w-6 border-2 border-green-600 border-t-transparent"></div>
        <span class="text-gray-700">Creating your account...</span>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerData = {
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    profession: ''
  };
  
  acceptTerms = false;
  showPassword = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  onRegister() {
    if (!this.isFormValid()) {
      this.showError('Please fill in all required fields correctly');
      return;
    }

    if (!this.acceptTerms) {
      this.showError('Please accept the Terms of Service and Privacy Policy');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Create user object matching your User model
    const newUser: User = {
      name: this.registerData.name,
      email: this.registerData.email,
      phoneNumber: this.registerData.phoneNumber,
      password: this.registerData.password,
      profession: this.registerData.profession
    };

    this.authService.register(newUser).subscribe({
      next: (response) => {
        console.log(response);
        
        this.isLoading = false;
        this.successMessage = 'Account created successfully! Redirecting to login...';
        
        // Redirect to login page after successful registration
        setTimeout(() => {
          this.router.navigate(['/login'], { 
            queryParams: { message: 'Registration successful. Please log in.' }
          });
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Registration error:', error);
        
        // Handle different error scenarios
        if (error.status === 409) {
          this.showError('Email address is already registered');
        } else if (error.status === 400) {
          this.showError(error.error?.message || 'Invalid registration data');
        } else if (error.status === 0) {
          this.showError('Unable to connect to server. Please try again.');
        } else {
          this.showError(error.error?.message || 'Registration failed. Please try again.');
        }
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  getPasswordStrength(): number {
    const password = this.registerData.password;
    let strength = 0;
    
    if (password.length >= 6) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;
    
    return strength;
  }

  getPasswordStrengthClass(index: number): string {
    const strength = this.getPasswordStrength();
    if (index < strength) {
      switch (strength) {
        case 1: return 'bg-red-400';
        case 2: return 'bg-yellow-400';
        case 3: return 'bg-blue-400';
        case 4: return 'bg-green-400';
        default: return 'bg-gray-200';
      }
    }
    return 'bg-gray-200';
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    switch (strength) {
      case 0: return 'Password too short';
      case 1: return 'Weak password';
      case 2: return 'Fair password';
      case 3: return 'Good password';
      case 4: return 'Strong password';
      default: return '';
    }
  }

  private isFormValid(): boolean {
    return (
      this.registerData.name.trim().length >= 2 &&
      this.isValidEmail(this.registerData.email) &&
      this.registerData.phoneNumber.trim().length > 0 &&
      this.registerData.password.length >= 6 &&
      this.registerData.profession.trim().length > 0
    );
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }
}
