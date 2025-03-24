
import { fetchUserTransactions } from './transactionService';
import { fetchUserWallet } from './walletService';
import { PerformanceDataPoint } from '@/types/dashboard';

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
