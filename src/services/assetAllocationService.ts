
import { fetchUserTransactions } from './transactionService';
import { fetchUserWallet } from './walletService';
import { AssetAllocation } from '@/types/dashboard';

// Calculate asset allocation based on transactions
export const calculateAssetAllocation = async (): Promise<{ data: AssetAllocation[] | null; error?: any }> => {
  try {
    // Get wallet data to know current balance
    const { data: wallet } = await fetchUserWallet();
    
    if (!wallet) {
      return { data: null, error: 'No wallet found' };
    }
    
    // Get all transactions
    const { data: transactions } = await fetchUserTransactions(wallet.id);
    
    if (!transactions) {
      return { data: null, error: 'No transactions found' };
    }
    
    // Calculate investments by analyzing transaction details
    let usdqBalance = wallet.balance;
    let investments: Record<string, number> = {};
    
    // Process investment transactions
    transactions.forEach(transaction => {
      // Check if this is an investment (stored in details field)
      if (transaction.type === 'withdraw' && transaction.details && transaction.details.startsWith('Inversión:')) {
        const projectName = transaction.details.replace('Inversión:', '').trim();
        const amount = parseFloat(transaction.amount.toString());
        
        if (!investments[projectName]) {
          investments[projectName] = 0;
        }
        
        investments[projectName] += amount;
      }
    });
    
    // Calculate total invested amount
    const totalInvested = Object.values(investments).reduce((sum, amount) => sum + amount, 0);
    const totalAssets = usdqBalance + totalInvested;
    
    // If there are no assets, return a default allocation
    if (totalAssets <= 0) {
      return { 
        data: [
          { name: 'USDQ', value: 100 }
        ] 
      };
    }
    
    // Calculate USDQ percentage
    const usdqPercentage = Math.round((usdqBalance / totalAssets) * 100);
    
    // Create allocation data
    const allocationData: AssetAllocation[] = [
      { name: 'USDQ', value: usdqPercentage }
    ];
    
    // Add investment allocations
    Object.entries(investments).forEach(([project, amount]) => {
      const percentage = Math.round((amount / totalAssets) * 100);
      if (percentage > 0) {
        allocationData.push({
          name: project,
          value: percentage
        });
      }
    });
    
    // Make sure percentages add up to 100%
    const totalPercentage = allocationData.reduce((sum, item) => sum + item.value, 0);
    if (totalPercentage < 100 && allocationData.length > 0) {
      // Add the remaining percentage to the largest allocation
      allocationData.sort((a, b) => b.value - a.value);
      allocationData[0].value += (100 - totalPercentage);
    }
    
    return { data: allocationData };
  } catch (error) {
    console.error('Error calculating asset allocation:', error);
    return { data: null, error };
  }
};
