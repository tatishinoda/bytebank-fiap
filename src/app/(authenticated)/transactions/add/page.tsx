'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { TransactionType } from '@/models/Transaction';
import { useTransactions } from '@/hooks/useTransactions';

export default function AddTransactionPage() {
  const router = useRouter();
  const { addTransaction } = useTransactions();
  
  const [type, setType] = useState<TransactionType>(TransactionType.DEPOSIT);
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState<string>('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
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
        Number(amount),
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
    <div>
      <h1 className='text-2xl font-bold text-gray-800 mb-6'>Nova Transação</h1>
      
      <Card className='max-w-2xl mx-auto'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {error && (
            <div className="text-red-600 text-sm mb-4" role="alert">
              {error}
            </div>
          )}
          <div>
            <label htmlFor='type' className='block text-sm font-medium text-gray-700 mb-1'>
              Tipo de Transação*
            </label>
            <select
              id='type'
              value={type}
              onChange={(e) => setType(e.target.value as TransactionType)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#004D61] focus:border-[#004D61]'
              required
            >
              <option value={TransactionType.DEPOSIT}>Depósito</option>
              <option value={TransactionType.WITHDRAWAL}>Saque</option>
              <option value={TransactionType.TRANSFER}>Transferência</option>
              <option value={TransactionType.PAYMENT}>Pagamento</option>
            </select>
          </div>
          
          <div>
            <label htmlFor='amount' className='block text-sm font-medium text-gray-700 mb-1'>
              Valor*
            </label>
            <div className='relative'>
              <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500'>
                R$
              </span>
              <input
                type='text'
                id='amount'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder='0,00'
                className='w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#004D61] focus:border-[#004D61]'
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor='date' className='block text-sm font-medium text-gray-700 mb-1'>
              Data*
            </label>
            <input
              type='date'
              id='date'
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#004D61] focus:border-[#004D61]'
              required
            />
          </div>
          
          <div>
            <label htmlFor='description' className='block text-sm font-medium text-gray-700 mb-1'>
              Descrição
            </label>
            <input
              type='text'
              id='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Descrição da transação'
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#004D61] focus:border-[#004D61]'
            />
          </div>
          
          <div className='flex gap-4 pt-2'>
            <Button type='button' variant='secondary' onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button type='submit'>
              Adicionar Transação
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
