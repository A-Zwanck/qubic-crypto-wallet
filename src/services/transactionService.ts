
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/types/wallet';

// Handle deposit transactions
export const createDepositTransaction = async (
  userId: string,
  walletId: string,
  amount: number
): Promise<{ success: boolean; error?: any }> => {
  try {
    const { error } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        wallet_id: walletId,
        type: 'deposit',
        amount: amount,
        status: 'completed'
      });
    
    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error creating deposit transaction:', error);
    return { success: false, error };
  }
};

// Handle withdraw transactions
export const createWithdrawTransaction = async (
  userId: string,
  walletId: string,
  amount: number
): Promise<{ success: boolean; error?: any }> => {
  try {
    const { error } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        wallet_id: walletId,
        type: 'withdraw',
        amount: amount,
        status: 'completed'
      });
    
    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error creating withdraw transaction:', error);
    return { success: false, error };
  }
};

// Handle investment transactions (using withdraw type with investment details)
export const createInvestmentTransaction = async (
  userId: string,
  walletId: string,
  amount: number,
  projectName: string
): Promise<{ success: boolean; error?: any }> => {
  try {
    const { error } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        wallet_id: walletId,
        type: 'withdraw', // Using withdraw type due to database constraints
        amount: amount,
        status: 'completed',
        details: `Inversión: ${projectName}` // Track that it's an investment in the details
      });
    
    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error creating investment transaction:', error);
    return { success: false, error };
  }
};

// Fetch user transactions
export const fetchUserTransactions = async (
  walletId: string
): Promise<{ data: Transaction[] | null; error?: any }> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Ensure type safety by mapping transaction data
    const typedTransactions = data ? data.map(transaction => ({
      ...transaction,
      type: transaction.type as 'deposit' | 'withdraw' | 'investment',
      amount: typeof transaction.amount === 'string' ? parseFloat(transaction.amount) : transaction.amount
    })) : [];
    
    return { data: typedTransactions };
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return { data: null, error };
  }
};
