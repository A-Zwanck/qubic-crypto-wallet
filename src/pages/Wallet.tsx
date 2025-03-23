import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import SupportChat from '@/components/SupportChat';
import WalletCard from '@/components/wallet/WalletCard';
import TransactionsList from '@/components/wallet/TransactionsList';
import DepositDialog from '@/components/wallet/DepositDialog';
import WithdrawDialog from '@/components/wallet/WithdrawDialog';
import { useWalletService } from '@/hooks/useWalletService';
import { supabase } from '@/integrations/supabase/client';

const Wallet = () => {
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  const {
    balance,
    transactions,
    isLoading,
    isProcessing,
    fetchWalletData,
    handleDeposit,
    handleWithdraw
  } = useWalletService();

  // Load wallet data and transactions
  useEffect(() => {
    fetchWalletData();
    
    // Set up real-time listener for transactions
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions'
        },
        (payload) => {
          // Update transactions when changes occur
          fetchWalletData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Handle deposit form submission
  const onDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    const success = await handleDeposit(amount);
    
    if (success) {
      setIsDepositOpen(false);
      setDepositAmount('');
    }
  };

  // Handle withdraw form submission
  const onWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    const success = await handleWithdraw(amount);
    
    if (success) {
      setIsWithdrawOpen(false);
      setWithdrawAmount('');
    }
  };

  return (
    <div className="min-h-screen bg-qubic-gray flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 px-4 md:px-8">
        {isLoading ? (
          <div className="min-h-[50vh] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-qubic-blue" />
            <span className="ml-2 text-qubic-gray-dark">Cargando wallet...</span>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {/* Wallet Card Component */}
            <WalletCard 
              balance={balance}
              onDeposit={() => setIsDepositOpen(true)}
              onWithdraw={() => setIsWithdrawOpen(true)}
            />
            
            {/* Transactions List Component */}
            <TransactionsList 
              transactions={transactions}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterType={filterType}
              setFilterType={setFilterType}
              isLoading={isLoading}
            />
          </div>
        )}
      </main>
      
      {/* Deposit Dialog Component */}
      <DepositDialog 
        isOpen={isDepositOpen}
        onOpenChange={setIsDepositOpen}
        depositAmount={depositAmount}
        setDepositAmount={setDepositAmount}
        onSubmit={onDepositSubmit}
        isProcessing={isProcessing}
      />
      
      {/* Withdraw Dialog Component */}
      <WithdrawDialog 
        isOpen={isWithdrawOpen}
        onOpenChange={setIsWithdrawOpen}
        withdrawAmount={withdrawAmount}
        setWithdrawAmount={setWithdrawAmount}
        onSubmit={onWithdrawSubmit}
        isProcessing={isProcessing}
        balance={balance}
      />
      
      <Footer />
      <SupportChat />
    </div>
  );
};

export default Wallet;
