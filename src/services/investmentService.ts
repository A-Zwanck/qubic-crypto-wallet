
import { fetchUserTransactions } from './transactionService';
import { fetchUserWallet } from './walletService';
import { Investment } from '@/types/dashboard';

// Get current investments based on transaction history
export const getCurrentInvestments = async (): Promise<{ data: Investment[] | null; error?: any }> => {
  try {
    // Get wallet data
    const { data: wallet } = await fetchUserWallet();
    
    if (!wallet) {
      return { data: null, error: 'No wallet found' };
    }
    
    // Get all transactions
    const { data: transactions } = await fetchUserTransactions(wallet.id);
    
    if (!transactions) {
      return { data: null, error: 'No transactions found' };
    }
    
    // Track investments by project
    const investmentsByProject: Record<string, {
      invested: number;
      latestDate: string;
    }> = {};
    
    // Process investment transactions
    transactions.forEach(transaction => {
      if (transaction.type === 'withdraw' && transaction.details && transaction.details.startsWith('Inversión:')) {
        const projectName = transaction.details.replace('Inversión:', '').trim();
        const amount = parseFloat(transaction.amount.toString());
        
        if (!investmentsByProject[projectName]) {
          investmentsByProject[projectName] = {
            invested: 0,
            latestDate: transaction.created_at
          };
        }
        
        investmentsByProject[projectName].invested += amount;
        
        // Update latest date if this transaction is newer
        if (new Date(transaction.created_at) > new Date(investmentsByProject[projectName].latestDate)) {
          investmentsByProject[projectName].latestDate = transaction.created_at;
        }
      }
    });
    
    // Convert to array format with ROI calculations
    const investments: Investment[] = Object.entries(investmentsByProject).map(([project, data], index) => {
      // Use a fixed ROI calculation for consistency instead of random
      // This ensures the same ROI is shown for a project every time
      const projectHash = project.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const roiPercentage = 5 + (projectHash % 10); // ROI between 5% and 15%
      const currentValue = data.invested * (1 + roiPercentage / 100);
      
      return {
        id: `inv-${index + 1}`,
        project,
        invested: data.invested,
        current: currentValue,
        roi: `${roiPercentage.toFixed(1)}%`,
        date: data.latestDate
      };
    });
    
    return { data: investments };
  } catch (error) {
    console.error('Error getting current investments:', error);
    return { data: null, error };
  }
};
