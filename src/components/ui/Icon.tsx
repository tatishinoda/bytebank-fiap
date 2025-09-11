import { BanknoteArrowDown, BanknoteArrowUp, Edit, Trash2 } from 'lucide-react';
import { TransactionType } from '@/models/Transaction';
import React from 'react';

export function TransactionTypeIcon({ type, className = '' }: { type: TransactionType, className?: string }) {
  if (type === TransactionType.DEPOSIT || type === TransactionType.TRANSFER) {
    return <BanknoteArrowDown className={className} />;
  }
  return <BanknoteArrowUp className={className} />;
}

export { Edit, Trash2 };
