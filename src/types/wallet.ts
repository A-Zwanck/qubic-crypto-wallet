
// Shared types for wallet functionality
export type Transaction = {
  id: string;
  user_id: string;
  wallet_id: string;
  type: 'deposit' | 'withdraw' | 'investment';
  amount: number;
  status: string;
  created_at: string;
  details?: string;
};

export type WalletData = {
  id: string;
  balance: number;
  user_id: string;
  created_at: string | null;
  updated_at: string | null;
};
