'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { TransactionType } from '@/models/Transaction';
import { useTransactions } from '@/hooks/useTransactions';
import { TransactionService } from '@/services/TransactionService';
import { createCurrencyInputHandler, formatCurrencyWithoutSymbol, parseCurrencyStringToNumber } from '@/utils/currencyUtils';
import { formatDateForInput } from '@/utils/utils';
import '../../transactions.css';

export default function EditTransactionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { updateTransaction } = useTransactions();

  const [type, setType] = useState<TransactionType>(TransactionType.DEPOSIT);
  const [amount, setAmount] = useState<string>('');

  // Use the reusable currency input handler
  const handleAmountChange = createCurrencyInputHandler(setAmount);

  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        setLoading(true);
        const transaction = await TransactionService.getTransactionById(id);
        setType(transaction.type);
        setAmount(formatCurrencyWithoutSymbol(transaction.amount));
        setDescription(transaction.description || '');
        setDate(formatDateForInput(transaction.date));
        setError(null);
      } catch (error) {
        setError('Erro ao carregar os dados da transação');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

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

    if (!date) {
      setError('Por favor, selecione uma data.');
      return;
    }
    
    try {
      const [year, month, day] = date.split('-').map(Number);
      const localDate = new Date(year, month - 1, day);

      await updateTransaction(
        id,
        type,
        normalizedAmount,
        localDate,
        description
      );

      router.push('/transactions');
    } catch (error) {
      setError('Erro ao atualizar transação. Tente novamente.');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <p className='transactions-loading'>Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center py-10'>
        <p className='transactions-error-message'>{error}</p>
        <Button
          className='mt-4'
          variant='secondary'
          onClick={() => router.push('/transactions')}
        >
          Voltar para Transações
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-8 max-w-4xl mx-auto px-4'>
      <Card className='bg-white-50 rounded-xl shadow-md max-w-2xl'>
        <h1 className='text-3xl font-bold text-primary-700 mb-6'>
          Editar Transação
        </h1>
        <form onSubmit={handleSubmit} className='space-y-5'>
          {error && (
            <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'>
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
          </div>

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
              Salvar Alterações
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
