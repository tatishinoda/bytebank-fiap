"use client";

import Sidebar from "@/components/layout/Sidebar";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import TransactionBadge from "@/components/ui/TransactionBadge";
import { useTransactions } from "@/hooks/useTransactions";
import Link from "next/link";
import React from "react";
import { formatCurrency, getMonthName, formatDate } from "@/utils/dashboardUtils";
import "./transactions.css";

export default function TransactionsPage() {
  const { transactions, loading, deleteTransaction } = useTransactions();
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const [modalOpen, setModalOpen] = React.useState(false);
  const [transactionToDelete, setTransactionToDelete] = React.useState<
    string | null
  >(null);

  const handleDelete = async () => {
    if (transactionToDelete) {
      try {
        await deleteTransaction(transactionToDelete);
        setModalOpen(false);
        setTransactionToDelete(null);
      } catch (error) {
        // Show error toast instead of alert
        if (typeof window !== "undefined") {
          // Replace with your toast implementation, e.g.:
          // toast.error('Erro ao excluir transação.');
          // For demonstration, using console.error as fallback:
          console.error("Erro ao excluir transação.");
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
      const [monthA, yearA] = a.split("-").map(Number);
      const [monthB, yearB] = b.split("-").map(Number);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="transactions-loading">Carregando...</p>
      </div>
    );
  }

  return (
  <div className="container mx-auto px-4 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Menu lateral em telas maiores */}
        <div className="hidden bg-white-50 rounded-lg shadow-md xl:block lg:hidden md:col-span-1">
          <Sidebar />
        </div>

        {/* Conteúdo principal */}
        <div className="col-span-1 md:col-span-5 xl:col-span-4 space-y-6">
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h1 className="transactions-page-title">Extrato</h1>
              <Link href="/transactions/add">
                <Button variant="primary">Nova Transação</Button>
              </Link>
            </div>
            <div className="space-y-8">
              {transactions.length > 0 ? (
                sortedKeys.map((key) => {
                  const [month, year] = key.split("-").map(Number);
                  const monthName = getMonthName(month);

                  return (
                    <div key={key} className="space-y-4">
                      <h2 className="transactions-month-header">
                        {monthName} {year}
                      </h2>

                      <div className="space-y-3">
                        {grouped[key].map((transaction) => (
                          <div key={transaction.id} className="transaction-item flex justify-between items-center">
                            <div>
                              <div className="flex items-center">
                                <TransactionBadge type={transaction.type} />
                                <p className="transaction-date-small ml-2">
                                  {formatDate(transaction.date)}
                                </p>
                              </div>
                              <p className="transaction-description">
                                {transaction.description || "Sem descrição"}
                              </p>
                            </div>

                            <div className="flex flex-col items-end">
                              <p
                                className={`transaction-amount ${
                                  transaction.isIncome()
                                    ? "positive"
                                    : "negative"
                                }`}
                              >
                                {transaction.isIncome() ? "+" : "-"}{" "}
                                {formatCurrency(transaction.amount)}
                              </p>

                              <div className="mt-2 flex space-x-2">
                                <Link
                                  href={`/transactions/edit/${transaction.id}`}
                                >
                                  <Button variant="secondary" size="sm">
                                    Editar
                                  </Button>
                                </Link>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() =>
                                    openDeleteModal(transaction.id)
                                  }
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
                <div className="transactions-empty">
                  <p className="transactions-empty-title mb-2">
                    Nenhuma transação encontrada.
                  </p>
                  <Link href="/transactions/add">
                    <Button variant="primary">Adicionar nova transação</Button>
                  </Link>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50">
          <div className="modal-content">
            <h3 className="modal-title">Confirmar exclusão</h3>
            <p className="modal-text">
              Tem certeza que deseja excluir esta transação? Esta ação não pode
              ser desfeita.
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
