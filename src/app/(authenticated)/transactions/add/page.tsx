'use client';

import { useTransactions } from '@/hooks/useTransactions';
import { TransactionType } from '@/models/Transaction';
import { createCurrencyInputHandler, parseCurrencyStringToNumber } from '@/utils/currencyUtils';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import '../transactions.css';
import TransactionForm from '@/components/dashboard/TransactionForm';

export default function AddTransactionPage() {
  const router = useRouter();
  const { addTransaction } = useTransactions();

  const [transactionType, setTransactionType] = useState<TransactionType>(TransactionType.DEPOSIT);
  const [amount, setAmount] = useState<string>('');

  // Use the reusable currency input handler
  const handleAmountChange = createCurrencyInputHandler(setAmount);

  const [description, setDescription] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Use the reusable parser
    const normalizedAmount = parseCurrencyStringToNumber(amount);

    if (
      !amount ||
      isNaN(normalizedAmount) ||
      normalizedAmount <= 0
    ) {
      setError('Por favor, insira um número positivo maior que 0.');
      return;
    }

    try {
      await addTransaction(
        transactionType,
        normalizedAmount,
        new Date(),
        description
      );

      router.push('/transactions');
    } catch (error) {
      setError('Erro ao adicionar transação. Tente novamente.');
      console.error(error);
    }
  };

  return (
    <div className='space-y-8 max-w-4xl px-4 mx-auto'>
      {/* Nova transação */}
      <TransactionForm
        amount={amount}
        transactionType={transactionType}
        description={description}
        onAmountChange={handleAmountChange}
        onTypeChange={e => setTransactionType(e.target.value as TransactionType)}
        onDescriptionChange={e => setDescription(e.target.value)}
        onSubmit={handleSubmit}
      />
    </div>

  );
}
