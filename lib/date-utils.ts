import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import { Transaction, MonthlyExpense } from '@/types/transaction';

export function formatDate(date: string): string {
  return format(parseISO(date), 'MMM dd, yyyy');
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function getMonthlyExpenses(transactions: Transaction[]): MonthlyExpense[] {
  const monthlyMap = new Map<string, number>();
  
  transactions.forEach(transaction => {
    const monthKey = format(parseISO(transaction.date), 'MMM yyyy');
    const currentAmount = monthlyMap.get(monthKey) || 0;
    monthlyMap.set(monthKey, currentAmount + Math.abs(transaction.amount));
  });
  
  const sortedEntries = Array.from(monthlyMap.entries())
    .map(([month, amount]) => ({ month, amount }))
    .sort((a, b) => {
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      return dateA.getTime() - dateB.getTime();
    });
  
  return sortedEntries.slice(-6); // Last 6 months
}

export function getTotalExpenses(transactions: Transaction[]): number {
  return transactions.reduce((total, transaction) => {
    return total + Math.abs(transaction.amount);
  }, 0);
}

export function getThisMonthExpenses(transactions: Transaction[]): number {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  
  return transactions
    .filter(transaction => {
      const transactionDate = parseISO(transaction.date);
      return transactionDate >= monthStart && transactionDate <= monthEnd;
    })
    .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);
}