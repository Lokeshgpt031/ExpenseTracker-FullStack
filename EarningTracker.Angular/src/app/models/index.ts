// Enums
export enum EarningType {
  Regular = 'Regular',
  Bonus = 'Bonus',
  Overtime = 'Overtime',
  Commission = 'Commission',
  Freelance = 'Freelance',
  Investment = 'Investment',
  Gift = 'Gift',
  Other = 'Other'
}

export enum PaymentMethod {
  Cash = 'Cash',
  UPI = 'UPI',
  Card = 'Card',
  NetBanking = 'NetBanking',
  Cheque = 'Cheque',
  BankTransfer = 'BankTransfer',
  Wallet = 'Wallet',
  Other = 'Other'
}

export enum ExpenseCategory {
  LPG = 'LPG',
  Food = 'Food',
  Transportation = 'Transportation',
  Entertainment = 'Entertainment',
  Utilities = 'Utilities',
  Shopping = 'Shopping',
  Healthcare = 'Healthcare',
  Education = 'Education',
  Rent = 'Rent',
  Insurance = 'Insurance',
  Maintenance = 'Maintenance',
  Other = 'Other'
}

// Request Models
export interface CreateEarningRequest {
  date: string | Date; // ISO date string 
  amount: number;
  sourceId?: number;
  type?: EarningType;
  paymentMethod?: PaymentMethod;
}

export interface CreateExpenseRequest {
  date: string; // ISO date string
  amount: number;
  category?: ExpenseCategory;
  paymentMethod?: PaymentMethod;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  profession: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateUserRequest {
  name: string;
  phoneNumber: string;
  profession: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  phoneNumber: string;
  profession: string;
}

export interface CreateSourceRequest {
  name: string;
  description?: string;
}

// Response Models
export interface EarningResponse {
  id: number;
  date: string; // ISO date string
  amount: number;
  sourceName: string;
  type: EarningType;
  paymentMethod: PaymentMethod;
  createdAt: string; // ISO date string
}

export interface ExpenseResponse {
  id: number;
  date: string; // ISO date string
  amount: number;
  category: ExpenseCategory;
  paymentMethod: PaymentMethod;
  createdAt: string; // ISO date string
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  profession: string;
  createdAt: string; // ISO date string
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
  expiresAt: string; // ISO date string
}

export interface DailySummaryResponse {
  date: string; // ISO date string
  totalEarnings: number;
  totalExpenses: number;
  netIncome: number;
  earningsCount: number;
  expensesCount: number;
}

export interface TrendDataResponse {
  date: string; // ISO date string
  earnings: number;
  expenses: number;
  netIncome: number;
}

export interface AnalyticsResponse {
  totalEarnings: number;
  totalExpenses: number;
  netIncome: number;
  averageEarningsPerDay: number;
  averageExpensesPerDay: number;
  earningsBySource: { [key: string]: number };
  expensesByCategory: { [key: string]: number };
  weeklyTrends: TrendDataResponse[];
  monthlyTrends: TrendDataResponse[];
}

export interface SourceResponse {
  id: number;
  name: string;
  description?: string;
  createdAt: string; // ISO date string
}

// Legacy models for backward compatibility (if needed)
export interface User {
  id?: number;
  name: string;
  email: string;
  phoneNumber: string;
  password?: string;
  profession: string;
  role?: string;
  createdAt?: Date | string;
}

export interface Earning {
  id?: number;
  amount: number;
  description: string;
  source: string;
  date: Date | string;
  type?: EarningType;
  paymentMethod?: PaymentMethod;
}

export interface Expense {
  id?: number;
  amount: number;
  description: string;
  category: string;
  date: Date | string;
  paymentMethod?: PaymentMethod;
}

export interface AnalyticsData {
  totalEarnings: number;
  totalExpenses: number;
  netIncome: number;
  expensesByCategory: { [key: string]: number };
  earningsBySource: { [key: string]: number };
  monthlyData: MonthlyData[];
}

export interface MonthlyData {
  month: string;
  earnings: number;
  expenses: number;
}

// Utility types
export type CreateEarningPayload = Omit<CreateEarningRequest, 'date'> & {
  date: Date;
};

export type CreateExpensePayload = Omit<CreateExpenseRequest, 'date'> & {
  date: Date;
};

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

// Pagination types
export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginationParams {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

// Filter types
export interface EarningFilters extends PaginationParams {
  startDate?: string;
  endDate?: string;
  sourceId?: number;
  type?: EarningType;
  paymentMethod?: PaymentMethod;
  minAmount?: number;
  maxAmount?: number;
}

export interface ExpenseFilters extends PaginationParams {
  startDate?: string;
  endDate?: string;
  category?: ExpenseCategory;
  paymentMethod?: PaymentMethod;
  minAmount?: number;
  maxAmount?: number;
}

// Form validation types
export interface ValidationErrors {
  [key: string]: string[];
}

export interface FormState<T> {
  data: T;
  errors: ValidationErrors;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
}

// Dashboard types
export interface DashboardData {
  summary: DailySummaryResponse;
  recentEarnings: EarningResponse[];
  recentExpenses: ExpenseResponse[];
  analytics: AnalyticsResponse;
}

// Chart data types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface LineChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill?: boolean;
  }[];
}

export interface PieChartData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}
// Add this interface to your existing models
export interface SourceInfo {
  id: number;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
}
