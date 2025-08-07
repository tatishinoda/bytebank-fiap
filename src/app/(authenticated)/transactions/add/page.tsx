'use client';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useTransactions } from '@/hooks/useTransactions';
import { TransactionType } from '@/models/Transaction';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function AddTransactionPage() {
  const router = useRouter();
  const { addTransaction } = useTransactions();

  const [type, setType] = useState<TransactionType>(TransactionType.DEPOSIT);
  const [amount, setAmount] = useState<string>('');

  // Função para aplicar máscara de moeda brasileira
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Remove tudo que não é dígito
    value = value.replace(/\D/g, '');
    // Formata para centavos
    const intValue = parseInt(value, 10);
    if (isNaN(intValue)) {
      setAmount('');
      return;
    }
    // Divide por 100 para obter reais e centavos
    const formatted = (intValue / 100).toLocaleString('pt-BR', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    setAmount(formatted);
  };
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Aceita vírgula como separador decimal e remove pontos de milhar
    const normalizedAmount = amount.replace(/\./g, '').replace(/,/g, '.');

    if (!normalizedAmount || isNaN(Number(normalizedAmount)) || Number(normalizedAmount) <= 0) {
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
        Number(normalizedAmount),
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
                onChange={handleAmountChange}
                placeholder='0,00'
                inputMode='decimal'
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
