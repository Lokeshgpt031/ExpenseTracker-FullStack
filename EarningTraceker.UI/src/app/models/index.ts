export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
}

export interface Expense {
  id?: number;
  amount: number;
  description: string;
  category: string;
  date: Date | string;
  userId?: number;
}

export interface Earning {
  id?: number;
  amount: number;
  description: string;
  source: string;
  date: Date | string;
  userId?: number;
}

export interface AnalyticsData {
  totalExpenses: number;
  totalEarnings: number;
  netIncome: number;
  expensesByCategory: { [key: string]: number };
  earningsBySource: { [key: string]: number };
  monthlyData: {
    month: string;
    expenses: number;
    earnings: number;
  }[];
}
