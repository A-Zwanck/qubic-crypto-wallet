
import { supabase } from '@/integrations/supabase/client';
import { WalletData } from '@/types/wallet';

// Fetch user's wallet
export const fetchUserWallet = async (): Promise<{ data: WalletData | null; error?: any }> => {
  try {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .limit(1)
      .maybeSingle();
    
    if (error) {
      throw error;
    }
    
    return { data };
  } catch (error) {
    console.error('Error fetching wallet:', error);
    return { data: null, error };
  }
};

// Create wallet for user
export const createUserWallet = async (userId: string): Promise<{ data: WalletData | null; error?: any }> => {
  try {
    const { data, error } = await supabase
      .from('wallets')
      .insert({ user_id: userId })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return { data };
  } catch (error) {
    console.error('Error creating wallet:', error);
    return { data: null, error };
  }
};

// Update wallet balance
export const updateWalletBalance = async (
  walletId: string,
  newBalance: number
): Promise<{ success: boolean; error?: any }> => {
  try {
    const { error } = await supabase
      .from('wallets')
      .update({ balance: newBalance })
      .eq('id', walletId);
    
    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error updating wallet balance:', error);
    return { success: false, error };
  }
};

// Get current user ID from session
export const getCurrentUserId = async (): Promise<string | null> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    return sessionData.session?.user.id || null;
  } catch (error) {
    console.error('Error getting current user ID:', error);
    return null;
  }
};
