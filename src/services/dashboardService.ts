
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/types/wallet';
import { fetchUserTransactions } from './transactionService';
import { fetchUserWallet } from './walletService';

// Define types for performance data
export type PerformanceDataPoint = {
  name: string;
  value: number;
};

// Define types for asset allocation
export type AssetAllocation = {
  name: string;
  value: number;
};

// Define types for investment data
export type Investment = {
  id: string;
  project: string;
  invested: number;
  current: number;
  roi: string;
  date: string;
};

// Fetch wallet performance data based on transaction history
export const fetchPerformanceData = async (): Promise<{ data: PerformanceDataPoint[] | null; error?: any }> => {
  try {
    // Get wallet data to know current balance
    const { data: wallet } = await fetchUserWallet();
    
    if (!wallet || !wallet.id) {
      return { data: null, error: 'No wallet found' };
    }
    
    // Get all transactions
    const { data: transactions } = await fetchUserTransactions(wallet.id);
    
    if (!transactions) {
      return { data: null, error: 'No transactions found' };
    }
    
    // Group transactions by month to calculate balances over time
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const today = new Date();
    const monthsToShow = 12; // Show up to 12 months of data
    
    const performanceData: PerformanceDataPoint[] = [];
    let runningBalance = 0;
    
    // Get the starting month (12 months ago)
    const startDate = new Date();
    startDate.setMonth(today.getMonth() - (monthsToShow - 1));
    startDate.setDate(1); // First day of month
    
    // Prepare an array of months with initial values of 0
    for (let i = 0; i < monthsToShow; i++) {
      const monthDate = new Date(startDate);
      monthDate.setMonth(startDate.getMonth() + i);
      
      performanceData.push({
        name: monthNames[monthDate.getMonth()],
        value: 0
      });
    }
    
    // Calculate balance for each month based on transactions
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.created_at);
      // Only process transactions from the last 12 months
      if (transactionDate >= startDate) {
        const monthIndex = transactionDate.getMonth();
        const yearDiff = transactionDate.getFullYear() - startDate.getFullYear();
        const monthDiff = monthIndex - startDate.getMonth() + (yearDiff * 12);
        
        if (monthDiff >= 0 && monthDiff < monthsToShow) {
          const amount = parseFloat(transaction.amount.toString());
          if (transaction.type === 'deposit') {
            runningBalance += amount;
          } else if (transaction.type === 'withdraw') {
            runningBalance -= amount;
          }
          
          // Update the value for this month and all future months
          for (let i = monthDiff; i < monthsToShow; i++) {
            performanceData[i].value = runningBalance;
          }
        }
      }
    });
    
    return { data: performanceData };
  } catch (error) {
    console.error('Error fetching performance data:', error);
    return { data: null, error };
  }
};

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
      // For now, simulate ROI between 5% and 15%
      const roiPercentage = 5 + Math.random() * 10;
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

// Get total earnings
export const getTotalEarnings = async (): Promise<{ 
  currentBalance: number;
  initialInvestment: number;
  totalEarnings: number;
  earningsPercentage: number;
  error?: any 
}> => {
  try {
    // Get wallet data
    const { data: wallet } = await fetchUserWallet();
    
    if (!wallet) {
      return { 
        currentBalance: 0, 
        initialInvestment: 0, 
        totalEarnings: 0, 
        earningsPercentage: 0,
        error: 'No wallet found' 
      };
    }
    
    // Get all transactions
    const { data: transactions } = await fetchUserTransactions(wallet.id);
    
    if (!transactions || transactions.length === 0) {
      return { 
        currentBalance: wallet.balance, 
        initialInvestment: wallet.balance, 
        totalEarnings: 0, 
        earningsPercentage: 0 
      };
    }
    
    // Calculate total deposits (initial investment)
    const totalDeposits = transactions
      .filter(t => t.type === 'deposit')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
      
    // Calculate total withdrawals
    const totalWithdrawals = transactions
      .filter(t => t.type === 'withdraw')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
    
    // Current total value (wallet balance + estimated investments value)
    const { data: investments } = await getCurrentInvestments();
    const investmentsValue = investments 
      ? investments.reduce((sum, inv) => sum + inv.current, 0)
      : 0;
    
    const currentBalance = wallet.balance + investmentsValue;
    
    // Initial investment (total deposits)
    const initialInvestment = totalDeposits;
    
    // Total earnings calculation
    const totalEarnings = currentBalance - initialInvestment;
    
    // Calculate earnings percentage
    const earningsPercentage = initialInvestment > 0 
      ? (totalEarnings / initialInvestment) * 100
      : 0;
    
    return {
      currentBalance,
      initialInvestment,
      totalEarnings,
      earningsPercentage
    };
  } catch (error) {
    console.error('Error calculating total earnings:', error);
    return { 
      currentBalance: 0, 
      initialInvestment: 0, 
      totalEarnings: 0, 
      earningsPercentage: 0,
      error 
    };
  }
};
