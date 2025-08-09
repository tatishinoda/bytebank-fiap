'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { TransactionType } from '@/models/Transaction';
import { useTransactions } from '@/hooks/useTransactions';
import { TransactionService } from '@/services/TransactionService';
import '../../transactions.css';

export default function EditTransactionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { updateTransaction } = useTransactions();

  const [type, setType] = useState<TransactionType>(TransactionType.DEPOSIT);
  const [amount, setAmount] = useState<string>('');
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
        setAmount(transaction.amount.toString());
        setDescription(transaction.description || '');
        setDate(transaction.date.toISOString().split('T')[0]);
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

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Por favor, insira um valor válido.');
      return;
    }

    if (!date) {
      setError('Por favor, selecione uma data.');
      return;
    }

    try {
      await updateTransaction(
        id,
        type,
        Number(amount),
        new Date(date),
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
    <div className='transactions-container'>
      <h1 className='transactions-page-title'>Editar Transação</h1>

      <Card className='transactions-form-container'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {error && (
            <div className='transactions-error-message'>
              {error}
            </div>
          )}
          <div>
            <label htmlFor='type' className='transactions-form-label'>
              Tipo de Transação*
            </label>
            <select
              id='type'
              value={type}
              onChange={(e) => setType(e.target.value as TransactionType)}
              className='transactions-form-select'
              required
            >
              <option value={TransactionType.DEPOSIT}>Depósito</option>
              <option value={TransactionType.WITHDRAWAL}>Saque</option>
              <option value={TransactionType.TRANSFER}>Transferência</option>
              <option value={TransactionType.PAYMENT}>Pagamento</option>
            </select>
          </div>

          <div>
            <label htmlFor='amount' className='transactions-form-label'>
              Valor*
            </label>
            <div className='relative'>
              <span className='absolute inset-y-0 left-0 flex items-center pl-3 transactions-currency-prefix'>
                R$
              </span>
              <input
                type='text'
                id='amount'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder='0,00'
                className='transactions-form-input pl-10'
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor='date' className='transactions-form-label'>
              Data*
            </label>
            <input
              type='date'
              id='date'
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className='transactions-form-input'
              required
            />
          </div>

          <div>
            <label htmlFor='description' className='transactions-form-label'>
              Descrição
            </label>
            <input
              type='text'
              id='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Descrição da transação'
              className='transactions-form-input'
            />
          </div>

          <div className='flex gap-4 pt-2'>
            <Button type='button' variant='secondary' onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button type='submit' variant='primary'>
              Salvar Alterações
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
