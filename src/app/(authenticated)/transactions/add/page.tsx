'use client';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useTransactions } from '@/hooks/useTransactions';
import { TransactionType } from '@/models/Transaction';
import { createCurrencyInputHandler, parseCurrencyValue } from '@/utils/currencyUtils';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import '../transactions.css';

export default function AddTransactionPage() {
  const router = useRouter();
  const { addTransaction } = useTransactions();

  const [type, setType] = useState<TransactionType>(TransactionType.DEPOSIT);
  const [amount, setAmount] = useState<string>('');

  // Use the reusable currency input handler
  const handleAmountChange = createCurrencyInputHandler(setAmount);

  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Use the reusable parser
    const normalizedAmount = parseCurrencyValue(amount);

    if (
      !amount ||
      isNaN(normalizedAmount) ||
      normalizedAmount <= 0
    ) {
      setError('Por favor, insira um número positivo maior que 0.');
      return;
    }

    if (!date) {
      setError('Por favor, selecione uma data.');
      return;
    }

    try {
      await addTransaction(
        type,
        normalizedAmount,
        new Date(date),
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
      <Card className='bg-white-50 rounded-xl shadow-md max-w-2xl'>
        <h1 className='text-3xl font-bold text-primary-700 mb-6'>
          Nova Transação
        </h1>
        <form onSubmit={handleSubmit} className='space-y-5'>
          {error && (
            <div
              className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'
              role='alert'
            >
              {error}
            </div>
          )}
          <div>
            <label
              htmlFor='type'
              className='block text-sm font-medium text-primary-700 mb-1'
            >
              Tipo de Transação*
            </label>
            <select
              id='type'
              value={type}
              onChange={(e) => setType(e.target.value as TransactionType)}
              className='w-full px-4 py-3 rounded-lg border border-primary-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-700 bg-white-50'
              required
            >
              <option value={TransactionType.DEPOSIT}>Depósito</option>
              <option value={TransactionType.WITHDRAWAL}>Saque</option>
              <option value={TransactionType.TRANSFER}>Transferência</option>
              <option value={TransactionType.PAYMENT}>Pagamento</option>
            </select>
          </div>{' '}
          <div>
            <label
              htmlFor='amount'
              className='block text-sm font-medium text-primary-700 mb-1'
            >
              Valor*
            </label>
            <div className='relative'>
              <span className='absolute inset-y-0 left-0 flex items-center pl-4 text-white-800'>
                R$
              </span>
              <input
                type='text'
                id='amount'
                value={amount}
                onChange={handleAmountChange}
                placeholder='0,00'
                inputMode='decimal'
                className='w-full pl-12 pr-4 py-3 rounded-lg border border-primary-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-700'
                required
              />
            </div>
          </div>
          <div>
            <label
              htmlFor='date'
              className='block text-sm font-medium text-primary-700 mb-1'
            >
              Data*
            </label>
            <input
              type='date'
              id='date'
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className='w-full px-4 py-3 rounded-lg border border-primary-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-700'
              required
            />
          </div>
          <div>
            <label
              htmlFor='description'
              className='block text-sm font-medium text-primary-700 mb-1'
            >
              Descrição (opcional)
            </label>
            <input
              type='text'
              id='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Descrição da transação'
              className='w-full px-4 py-3 rounded-lg border border-primary-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-700'
            />
          </div>
          <div className='flex gap-4 pt-4'>
            <Button
              type='button'
              variant='secondary'
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              variant='active'
              className='bg-tertiary-600 hover:bg-tertiary-700 text-white-50 font-medium'
            >
              Adicionar Transação
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
