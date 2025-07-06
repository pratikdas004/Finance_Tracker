'use client';

import { useState, useEffect } from 'react';
import { Transaction } from '@/types/transaction';
import { getTransactions } from '@/lib/storage';
import { TransactionForm } from '@/components/transaction-form';
import { TransactionList } from '@/components/transaction-list';
import { ExpenseChart } from '@/components/expense-chart';
import { DashboardStats } from '@/components/dashboard-stats';
import { Wallet } from 'lucide-react';

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = () => {
    setIsLoading(true);
    const loadedTransactions = getTransactions();
    setTransactions(loadedTransactions);
    setIsLoading(false);
  };

  const handleTransactionAdded = () => {
    loadTransactions();
    setEditingTransaction(undefined);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleCancelEdit = () => {
    setEditingTransaction(undefined);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary rounded-full">
              <Wallet className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Personal Finance Tracker
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Track your expenses and visualize your spending patterns
          </p>
        </div>

        {/* Dashboard Stats */}
        <div className="mb-8">
          <DashboardStats transactions={transactions} />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form and Chart */}
          <div className="space-y-6">
            <TransactionForm
              editingTransaction={editingTransaction}
              onTransactionAdded={handleTransactionAdded}
              onCancel={editingTransaction ? handleCancelEdit : undefined}
            />
            
            <ExpenseChart transactions={transactions} />
          </div>

          {/* Right Column - Transaction List */}
          <div className="space-y-6">
            <TransactionList
              transactions={transactions}
              onEditTransaction={handleEditTransaction}
              onTransactionDeleted={loadTransactions}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Built with Next.js, React, and shadcn/ui</p>
        </div>
      </div>
    </div>
  );
}