"use client";

import Sidebar from "@/components/layout/Sidebar";
import BalanceCard from "@/components/dashboard/BalanceCard";
import TransactionForm from "@/components/dashboard/TransactionForm";
import StatementCard from "@/components/dashboard/StatementCard";
import { useAccount } from "@/hooks/useAccount";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionType } from "@/models/Transaction";
import { createCurrencyInputHandler, parseCurrencyStringToNumber } from "@/utils/currencyUtils";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

export default function Dashboard() {
  // Estado para exibir ou esconder o saldo
  const [showBalance, setShowBalance] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>("");

  // Handler reutilizável para campo de valor monetário
  const handleAmountChange = createCurrencyInputHandler(setAmount);

  const [transactionType, setTransactionType] = useState<TransactionType>(TransactionType.DEPOSIT);
  const [description, setDescription] = useState<string>("");
  const [formLoading, setFormLoading] = useState(false);

  const { account, loading: accountLoading, refreshAccount } = useAccount();
  const { loading: transactionsLoading, addTransaction } = useTransactions();

  // Adiciona uma nova transação
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setFormLoading(true);

    const normalizedAmount = parseCurrencyStringToNumber(amount);

    if (!amount || isNaN(normalizedAmount) || normalizedAmount <= 0) {
      toast.error("Por favor, insira um valor válido.");
      setFormLoading(false);
      return;
    }

    try {
      await addTransaction(
        transactionType,
        normalizedAmount,
        new Date(),
        description
      );

      // Atualiza saldo após nova transação
      try {
        await refreshAccount();
      } catch (refreshError) {
        console.error("Erro ao atualizar saldo da conta:", refreshError);
      }

      setAmount("");
      setDescription("");
      toast.success("Transação adicionada com sucesso!");
    } catch (error) {
      toast.error("Erro ao adicionar transação.");
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  if (accountLoading || transactionsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 space-y-8">
      <div className="grid md:grid-cols-5 gap-6">
        {/* Sidebar em telas maiores */}
        <div className="hidden bg-white-50 rounded-lg shadow-md xl:block lg:hidden md:col-span-1">
          <Sidebar />
        </div>

        {/* Conteúdo principal */}
        <div className="md:col-span-3 space-y-6">
          {/* Saldo e transações recentes */}
          <BalanceCard
            accountName={account?.name}
            balance={account?.balance}
            showBalance={showBalance}
            onToggleBalance={() => setShowBalance((prev) => !prev)}
          />

          {/* Nova transação */}
          <TransactionForm
            amount={amount}
            transactionType={transactionType}
            description={description}
            onAmountChange={handleAmountChange}
            onTypeChange={(e) => setTransactionType(e.target.value as TransactionType)}
            onDescriptionChange={(e) => setDescription(e.target.value)}
            onSubmit={handleSubmit}
            loading={formLoading}
          />
        </div>
        
        {/* Extrato */}
        <StatementCard />
      </div>
    </div>
  );
}
