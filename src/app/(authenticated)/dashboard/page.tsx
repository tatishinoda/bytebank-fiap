'use client';

import Sidebar from '@/components/layout/Sidebar';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import TransactionBadge from '@/components/ui/TransactionBadge';
import { useAccount } from '@/hooks/useAccount';
import { useTransactions } from '@/hooks/useTransactions';
import { Transaction, TransactionType } from '@/models/Transaction';
import Link from 'next/link';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

type GroupedTransactions = {
  grouped: Record<string, Transaction[]>;
  sortedKeys: string[];
};

export default function Dashboard() {
  const [amount, setAmount] = useState<string>('');
  const [transactionType, setTransactionType] = useState<TransactionType>(TransactionType.DEPOSIT);
  const [description, setDescription] = useState<string>('');

  const { account, loading: accountLoading, refreshAccount } = useAccount();
  const { transactions, loading: transactionsLoading, addTransaction } = useTransactions();

  // Get the 5 most recent transactions.
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Helper function to group transactions by month.
  const groupTransactionsByMonth = (transactions: Transaction[]): GroupedTransactions => {
    const grouped: Record<string, Transaction[]> = {};

    // First group transactions by month.
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getMonth()}-${date.getFullYear()}`;

      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }

      grouped[monthKey].push(transaction);
    });

    // Then sort each group internally.
    Object.keys(grouped).forEach(key => {
      grouped[key] = grouped[key].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    });

    // Sort months (from newest to oldest).
    const sortedKeys = Object.keys(grouped).sort((a, b) => {
      const [monthA, yearA] = a.split('-').map(Number);
      const [monthB, yearB] = b.split('-').map(Number);

      if (yearA !== yearB) {
        return yearB - yearA;
      }

      return monthB - monthA;
    });

    return { grouped, sortedKeys };
  };

  // Function to get the month name.
  const getMonthName = (month: string | number): string => {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return months[Number(month)];
  };

  // Group transactions by month.
  const { grouped, sortedKeys } = groupTransactionsByMonth(recentTransactions);

  // Format currency function.
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Get formatted current date.
  const getCurrentDateFormatted = (): string => {
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const today = new Date();
    const dayName = days[today.getDay()];
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    return `${dayName}, ${day}/${month}/${year}`;
  };

  // Logic to add a new transaction.
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Por favor, insira um valor válido.');
      return;
    }

    try {
      await addTransaction(
        transactionType,
        Number(amount),
        new Date(),
        description
      );

      // Refresh account balance after successful transaction
      try {
        await refreshAccount();
      } catch (refreshError) {
        console.error('Erro ao atualizar saldo da conta:', refreshError);
      }

      setAmount('');
      setDescription('');
      toast.success('Transação adicionada com sucesso!');
    } catch (error) {
      toast.error('Erro ao adicionar transação.');
      console.error(error);
    }
  };

  if (accountLoading || transactionsLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className='space-y-8 max-w-7xl mx-auto'>
      <div className='grid md:grid-cols-5 gap-6'>
        {/* Menu lateral em telas maiores */}
        <div className='hidden md:block md:col-span-1'>
          <Sidebar />
        </div>

        {/* Conteúdo principal */}
        <div className='md:col-span-4 space-y-6'>
          {/* Saldo e transações recentes */}
          <div className='balance-card'>
            <div className='space-y-4'>
              <div>
                <h1 className='balance-title'>
                  Olá, {account?.name ? account.name.split(' ')[0] : 'Usuário'}! :)
                </h1>
                <p className='balance-subtitle'>{getCurrentDateFormatted()}</p>
              </div>

              <div className='balance-card-divider'>
                <div className='flex items-center justify-between'>
                  <h2 className='balance-title'>Saldo</h2>
                </div>
                <p className='balance-subtitle'>Conta Corrente</p>
                <p className='balance-amount'>
                  {formatCurrency(account?.balance || 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Nova transação */}
          <Card className='bg-white rounded-xl shadow-md'>
            <h2 className='text-xl font-semibold text-gray-800 mb-5'>
              Nova transação
            </h2>

            <form onSubmit={handleSubmit} className='space-y-5'>
              <div>
                <select
                  id='type'
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value as TransactionType)}
                  className='w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#004D61] focus:border-[#004D61] bg-white'
                >
                  <option value={TransactionType.DEPOSIT}>Depósito</option>
                  <option value={TransactionType.WITHDRAWAL}>Saque</option>
                  <option value={TransactionType.TRANSFER}>Transferência</option>
                  <option value={TransactionType.PAYMENT}>Pagamento</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Valor
                </label>
                <div className='relative'>
                  <span className='absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500'>
                    R$
                  </span>
                  <input
                    type='text'
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder='00,00'
                    className='w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#004D61] focus:border-[#004D61]'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Descrição (opcional)
                </label>
                <input
                  type='text'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder='Descrição da transação'
                  className='w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#004D61] focus:border-[#004D61]'
                />
              </div>

              <div className='pt-2'>
                <Button type='submit' className='w-full py-3 bg-gradient-to-r from-[#004D61] to-[#006778] hover:from-[#00586E] hover:to-[#007A8F] text-white font-medium rounded-lg shadow-md'>
                  Concluir transação
                </Button>
              </div>
            </form>
          </Card>

          {/* Extrato */}
          <Card>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-medium text-gray-800'>Extrato</h2>
            </div>

            {recentTransactions.length > 0 ? (
              <div>
                {sortedKeys.map(key => {
                  const [month, year] = key.split('-');

                  return (
                    <div key={key} className='mb-6'>
                      <h3 className='font-medium text-blue-800 mb-2'>
                        {getMonthName(month)} {year}
                      </h3>

                      <div className='space-y-2'>
                        {grouped[key].map((transaction) => (
                          <div key={transaction.id} className='flex justify-between py-2 border-b'>
                            <div>
                              <TransactionBadge type={transaction.type} />
                              <p className='text-xs text-gray-500 mt-1'>
                                {transaction.description || 'Sem descrição'}
                              </p>
                            </div>
                            <div className='text-right'>
                              <p className={`text-sm font-medium ${transaction.isIncome() ? 'text-green-600' : 'text-red-600'}`}>
                                {transaction.isIncome() ? '+' : '-'} {formatCurrency(transaction.amount)}
                              </p>
                              <p className='text-xs text-gray-500'>
                                {new Date(transaction.date).getDate().toString().padStart(2, '0')}/
                                {(new Date(transaction.date).getMonth() + 1).toString().padStart(2, '0')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                <div className='mt-4'>
                  <Link href='/transactions'>
                    <Button variant='secondary' size='sm'>Ver todas as transações</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <p className='text-gray-500'>Nenhuma transação registrada.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
