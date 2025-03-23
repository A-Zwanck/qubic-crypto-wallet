
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type Transaction = {
  id: string;
  user_id: string;
  wallet_id: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  status: string;
  created_at: string;
};

export const useWalletService = () => {
  const [balance, setBalance] = useState(0);
  const [walletId, setWalletId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { toast } = useToast();

  // Fetch wallet data and transactions
  const fetchWalletData = async () => {
    try {
      setIsLoading(true);
      
      // Get the current user's wallet
      const { data: walletData, error: walletError } = await supabase
        .from('wallets')
        .select('*')
        .limit(1)
        .maybeSingle();
      
      if (walletError) {
        console.error('Error al cargar el wallet:', walletError);
        toast({
          title: 'Error',
          description: 'No se pudo cargar la información de tu wallet',
          variant: 'destructive',
        });
        return;
      }
      
      if (walletData) {
        setWalletId(walletData.id);
        // Convert balance to number before setting state
        setBalance(typeof walletData.balance === 'string' ? parseFloat(walletData.balance) : walletData.balance);
        
        // Load user transactions
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('transactions')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (transactionsError) {
          console.error('Error al cargar las transacciones:', transactionsError);
          toast({
            title: 'Error',
            description: 'No se pudieron cargar tus transacciones',
            variant: 'destructive',
          });
        } else if (transactionsData) {
          setTransactions(transactionsData);
        }
      } else {
        // If there's no wallet, the user might have just registered and the trigger hasn't executed yet
        toast({
          title: 'Información',
          description: 'Inicializando tu wallet. Puede tomar unos momentos.',
          variant: 'default',
        });
        
        // Try to create a wallet for the user
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData.session?.user.id;
        
        if (userId) {
          const { data: newWallet, error: createError } = await supabase
            .from('wallets')
            .insert({ user_id: userId })
            .select()
            .single();
          
          if (createError) {
            console.error('Error al crear wallet:', createError);
          } else if (newWallet) {
            setWalletId(newWallet.id);
            setBalance(0);
          }
        }
      }
    } catch (error) {
      console.error('Error inesperado:', error);
      toast({
        title: 'Error',
        description: 'Ha ocurrido un error inesperado',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Deposit funds
  const handleDeposit = async (amount: number) => {
    if (!walletId) {
      toast({
        title: 'Error',
        description: 'No se encontró tu wallet',
        variant: 'destructive',
      });
      return false;
    }
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Error',
        description: 'Por favor, introduce un monto válido',
        variant: 'destructive',
      });
      return false;
    }
    
    try {
      setIsProcessing(true);
      
      // 1. Get session for user_id
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;
      
      if (!userId) {
        toast({
          title: 'Error',
          description: 'No se pudo identificar tu usuario',
          variant: 'destructive',
        });
        return false;
      }
      
      // 2. Create the transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          wallet_id: walletId,
          type: 'deposit',
          amount: amount,
          status: 'completed'
        });
      
      if (transactionError) {
        throw transactionError;
      }
      
      // 3. Update the wallet balance
      const { error: walletError } = await supabase
        .from('wallets')
        .update({ balance: balance + amount })
        .eq('id', walletId);
      
      if (walletError) {
        throw walletError;
      }
      
      // 4. Update local state
      setBalance(balance + amount);
      
      toast({
        title: 'Depósito realizado',
        description: `Has depositado ${amount.toFixed(2)} USDQ correctamente`,
      });
      
      return true;
    } catch (error) {
      console.error('Error al procesar el depósito:', error);
      toast({
        title: 'Error',
        description: 'No se pudo completar el depósito',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // Withdraw funds
  const handleWithdraw = async (amount: number) => {
    if (!walletId) {
      toast({
        title: 'Error',
        description: 'No se encontró tu wallet',
        variant: 'destructive',
      });
      return false;
    }
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Error',
        description: 'Por favor, introduce un monto válido',
        variant: 'destructive',
      });
      return false;
    }
    
    if (amount > balance) {
      toast({
        title: 'Fondos insuficientes',
        description: 'No tienes suficiente saldo para realizar este retiro',
        variant: 'destructive',
      });
      return false;
    }
    
    try {
      setIsProcessing(true);
      
      // 1. Get session for user_id
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;
      
      if (!userId) {
        toast({
          title: 'Error',
          description: 'No se pudo identificar tu usuario',
          variant: 'destructive',
        });
        return false;
      }
      
      // 2. Create the transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          wallet_id: walletId,
          type: 'withdraw',
          amount: amount,
          status: 'completed'
        });
      
      if (transactionError) {
        throw transactionError;
      }
      
      // 3. Update the wallet balance
      const { error: walletError } = await supabase
        .from('wallets')
        .update({ balance: balance - amount })
        .eq('id', walletId);
      
      if (walletError) {
        throw walletError;
      }
      
      // 4. Update local state
      setBalance(balance - amount);
      
      toast({
        title: 'Retiro realizado',
        description: `Has retirado ${amount.toFixed(2)} USDQ correctamente`,
      });
      
      return true;
    } catch (error) {
      console.error('Error al procesar el retiro:', error);
      toast({
        title: 'Error',
        description: 'No se pudo completar el retiro',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    balance,
    transactions,
    isLoading,
    isProcessing,
    fetchWalletData,
    handleDeposit,
    handleWithdraw
  };
};
