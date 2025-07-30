'use client';

import { useState, useEffect, useCallback } from 'react';
import { Transaction, TransactionType } from '../models/Transaction';
import { TransactionService } from '../services/TransactionService';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await TransactionService.getAllTransactions();
      setTransactions(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch transactions'));
    } finally {
      setLoading(false);
    }
  }, []);

  const addTransaction = useCallback(async (
    type: TransactionType,
    amount: number,
    date: Date,
    description?: string
  ) => {
    try {
      const newTransaction = await TransactionService.addTransaction(type, amount, date, description);
      
      // Add the new transaction at the beginning of the array.
      setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
      
      return newTransaction;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add transaction');
    }
  }, []);

  const updateTransaction = useCallback(async (
    id: string,
    type: TransactionType,
    amount: number,
    date: Date,
    description?: string
  ) => {
    try {
      const updatedTransaction = await TransactionService.updateTransaction(id, type, amount, date, description);
      
      // Update the transaction in local state.
      setTransactions(prevTransactions => 
        prevTransactions.map(t => t.id === id ? updatedTransaction : t)
      );
      
      return updatedTransaction;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update transaction');
    }
  }, []);

  const deleteTransaction = useCallback(async (id: string) => {
    try {
      const success = await TransactionService.deleteTransaction(id);
      
      if (success) {
        // Remove the transaction from local state immediately.
        setTransactions(prevTransactions => 
          prevTransactions.filter(t => t.id !== id)
        );
      }
      
      return success;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete transaction');
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction
  };
}
