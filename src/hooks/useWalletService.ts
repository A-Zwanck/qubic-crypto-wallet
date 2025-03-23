
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Transaction } from '@/types/wallet';
import { 
  fetchUserWallet, 
  createUserWallet, 
  updateWalletBalance, 
  getCurrentUserId 
} from '@/services/walletService';
import { 
  fetchUserTransactions, 
  createDepositTransaction, 
  createWithdrawTransaction, 
  createInvestmentTransaction 
} from '@/services/transactionService';

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
      const { data: walletData, error: walletError } = await fetchUserWallet();
      
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
        const { data: transactionsData, error: transactionsError } = await fetchUserTransactions(walletData.id);
        
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
        const userId = await getCurrentUserId();
        
        if (userId) {
          const { data: newWallet, error: createError } = await createUserWallet(userId);
          
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
      
      // 1. Get user ID
      const userId = await getCurrentUserId();
      
      if (!userId) {
        toast({
          title: 'Error',
          description: 'No se pudo identificar tu usuario',
          variant: 'destructive',
        });
        return false;
      }
      
      // 2. Create the transaction
      const { success: transactionSuccess, error: transactionError } = 
        await createDepositTransaction(userId, walletId, amount);
      
      if (!transactionSuccess) {
        throw transactionError;
      }
      
      // 3. Update the wallet balance
      const newBalance = balance + amount;
      const { success: walletSuccess, error: walletError } = 
        await updateWalletBalance(walletId, newBalance);
      
      if (!walletSuccess) {
        throw walletError;
      }
      
      // 4. Update local state
      setBalance(newBalance);
      
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
      
      // 1. Get user ID
      const userId = await getCurrentUserId();
      
      if (!userId) {
        toast({
          title: 'Error',
          description: 'No se pudo identificar tu usuario',
          variant: 'destructive',
        });
        return false;
      }
      
      // 2. Create the transaction
      const { success: transactionSuccess, error: transactionError } = 
        await createWithdrawTransaction(userId, walletId, amount);
      
      if (!transactionSuccess) {
        throw transactionError;
      }
      
      // 3. Update the wallet balance
      const newBalance = balance - amount;
      const { success: walletSuccess, error: walletError } = 
        await updateWalletBalance(walletId, newBalance);
      
      if (!walletSuccess) {
        throw walletError;
      }
      
      // 4. Update local state
      setBalance(newBalance);
      
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

  // Investment function
  const handleInvestment = async (amount: number, projectName: string) => {
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
        description: 'No tienes suficiente saldo para realizar esta inversión',
        variant: 'destructive',
      });
      return false;
    }
    
    try {
      setIsProcessing(true);
      
      // 1. Get user ID
      const userId = await getCurrentUserId();
      
      if (!userId) {
        toast({
          title: 'Error',
          description: 'No se pudo identificar tu usuario',
          variant: 'destructive',
        });
        return false;
      }
      
      // 2. Create the investment transaction
      const { success: transactionSuccess, error: transactionError } = 
        await createInvestmentTransaction(userId, walletId, amount, projectName);
      
      if (!transactionSuccess) {
        throw transactionError;
      }
      
      // 3. Update the wallet balance
      const newBalance = balance - amount;
      const { success: walletSuccess, error: walletError } = 
        await updateWalletBalance(walletId, newBalance);
      
      if (!walletSuccess) {
        throw walletError;
      }
      
      // 4. Update local state
      setBalance(newBalance);
      
      toast({
        title: 'Inversión realizada',
        description: `Has invertido ${amount.toFixed(2)} USDQ en ${projectName} correctamente`,
      });
      
      // Refresh transactions list
      fetchWalletData();
      
      return true;
    } catch (error) {
      console.error('Error al procesar la inversión:', error);
      toast({
        title: 'Error',
        description: 'No se pudo completar la inversión',
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
    handleWithdraw,
    handleInvestment
  };
};
