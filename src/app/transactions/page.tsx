'use client';

import React from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useTransactions } from '@/hooks/useTransactions';
import TransactionBadge from '@/components/ui/TransactionBadge';

export default function TransactionsPage() {
  const { transactions, loading, deleteTransaction } = useTransactions();
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const [modalOpen, setModalOpen] = React.useState(false);
  const [transactionToDelete, setTransactionToDelete] = React.useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleDelete = async () => {
    if (transactionToDelete) {
      try {
        await deleteTransaction(transactionToDelete);
        setModalOpen(false);
        setTransactionToDelete(null);
      } catch (error) {
        // Show error toast instead of alert
        if (typeof window !== 'undefined') {
          // Replace with your toast implementation, e.g.:
          // toast.error('Erro ao excluir transação.');
          // For demonstration, using console.error as fallback:
          console.error('Erro ao excluir transação.');
        }
        console.error(error);
      }
    }
  };

  const openDeleteModal = (id: string) => {
    setTransactionToDelete(id);
    setModalOpen(true);
  };

  const closeDeleteModal = () => {
    setModalOpen(false);
    setTransactionToDelete(null);
  };

  // Group by month while maintaining reverse chronological order within each month.
  const getMonthKey = (date: Date) => {
    return `${date.getMonth()}-${date.getFullYear()}`;
  };

  const groupTransactionsByMonth = () => {
    const grouped: Record<string, typeof transactions> = {};

    sortedTransactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const monthKey = getMonthKey(date);

      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }

      grouped[monthKey].push(transaction);
    });

    // Sort months from newest to oldest.
    const sortedKeys = Object.keys(grouped).sort((a, b) => {
      const [monthA, yearA] = a.split('-').map(Number);
      const [monthB, yearB] = b.split('-').map(Number);

      if (yearA !== yearB) {
        return yearB - yearA; // Most recent year first.
      }

      return monthB - monthA; // Most recent month first.
    });

    // Sort each group of transactions from newest to oldest.
    for (const key of sortedKeys) {
      grouped[key] = grouped[key].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }

    return { grouped, sortedKeys };
  };

  const { grouped, sortedKeys } = groupTransactionsByMonth();

  const getMonthName = (month: number) => {
    const months = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];
    return months[month];
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className='max-w-5xl mx-auto'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>Extrato</h1>
        <Link href='/transactions/add'>
          <Button className='bg-[#004D61] hover:bg-[#006778]'>
            Nova Transação
          </Button>
        </Link>
      </div>

      <Card>
        <div className='space-y-8'>
          {transactions.length > 0 ? (
            sortedKeys.map((key) => {
              const [month, year] = key.split('-').map(Number);
              const monthName = getMonthName(month);

              return (
                <div key={key} className='space-y-4'>
                  <h2 className='text-lg font-medium text-blue-800'>
                    {monthName} {year}
                  </h2>

                  <div className='space-y-3'>
                    {grouped[key].map((transaction) => (
                      <div
                        key={transaction.id}
                        className='flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
                      >
                        <div>
                          <div className='flex items-center'>
                            <TransactionBadge type={transaction.type} />
                            <p className='text-sm text-gray-500 ml-2'>
                              {new Date(transaction.date).toLocaleDateString()}
                            </p>
                          </div>
                          <p className='mt-1'>
                            {transaction.description || 'Sem descrição'}
                          </p>
                        </div>

                        <div className='flex flex-col items-end'>
                          <p
                            className={`font-medium ${
                              transaction.isIncome()
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {transaction.isIncome() ? '+' : '-'}{' '}
                            {formatCurrency(transaction.amount)}
                          </p>

                          <div className='mt-2 flex space-x-2'>
                            <Link href={`/transactions/edit/${transaction.id}`}>
                              <Button variant='secondary' size='sm'>
                                Editar
                              </Button>
                            </Link>
                            <Button
                              variant='danger'
                              size='sm'
                              onClick={() => openDeleteModal(transaction.id)}
                            >
                              Excluir
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className='py-4 text-center text-gray-500'>
              <p className='mb-2'>Nenhuma transação encontrada.</p>
              <Link href='/transactions/add'>
                <Button>Adicionar nova transação</Button>
              </Link>
            </div>
          )}
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirmar exclusão</h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={closeDeleteModal}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
