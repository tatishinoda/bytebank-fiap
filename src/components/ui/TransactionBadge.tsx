import React from 'react';
import { TransactionType, getTransactionTypeLabel } from '@/models/Transaction';

interface TransactionBadgeProps {
  type: TransactionType;
}

const TransactionBadge = ({ type }: TransactionBadgeProps) => {  
  const getTransactionTypeColor = (type: TransactionType) => {
    const colors: Record<TransactionType, string> = {
      [TransactionType.DEPOSIT]: 'bg-green-100 text-green-700 border-green-300',
      [TransactionType.WITHDRAWAL]: 'bg-red-100 text-red-700 border-red-300',
      [TransactionType.TRANSFER]: 'bg-blue-100 text-blue-700 border-blue-300',
      [TransactionType.PAYMENT]: 'bg-orange-100 text-orange-700 border-orange-300'
    };
    return colors[type];
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getTransactionTypeColor(type)}`}>
      {getTransactionTypeLabel(type)}
    </span>
  );
};

export default TransactionBadge;
