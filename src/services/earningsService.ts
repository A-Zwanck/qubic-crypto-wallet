
import { fetchUserTransactions } from './transactionService';
import { fetchUserWallet } from './walletService';
import { EarningsData } from '@/types/dashboard';

// Get total earnings and overall wallet status
export const getTotalEarnings = async (): Promise<EarningsData> => {
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
    
    // Calculate total deposits
    const totalDeposits = transactions
      .filter(t => t.type === 'deposit')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
      
    // Calculate total withdrawals that are not investments
    const totalWithdrawals = transactions
      .filter(t => t.type === 'withdraw' && (!t.details || !t.details.startsWith('Inversión:')))
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
    
    // Get investment transactions
    const investmentTransactions = transactions
      .filter(t => t.type === 'withdraw' && t.details && t.details.startsWith('Inversión:'));
      
    // Group investments by project
    const investmentsByProject: Record<string, number> = {};
    
    investmentTransactions.forEach(t => {
      const projectName = t.details?.replace('Inversión:', '').trim() || '';
      const amount = parseFloat(t.amount.toString());
      
      if (!investmentsByProject[projectName]) {
        investmentsByProject[projectName] = 0;
      }
      
      investmentsByProject[projectName] += amount;
    });
    
    // Calculate current value of investments (with consistent ROI)
    const totalInvestedAmount = Object.values(investmentsByProject).reduce((sum, amount) => sum + amount, 0);
    let currentInvestmentsValue = 0;
    
    // For each investment, apply a consistent ROI between 5% and 15% based on project name
    Object.entries(investmentsByProject).forEach(([project, invested]) => {
      const projectHash = project.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const roiPercentage = 5 + (projectHash % 10); // ROI between 5% and 15%
      const currentValue = invested * (1 + roiPercentage / 100);
      currentInvestmentsValue += currentValue;
    });
    
    // Initial investment is the net deposits (deposits - non-investment withdrawals)
    const initialInvestment = totalDeposits - totalWithdrawals;
    
    // Current balance is wallet balance + current value of investments
    const currentBalance = wallet.balance + currentInvestmentsValue;
    
    // Total earnings calculation (current value - initial investment)
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
