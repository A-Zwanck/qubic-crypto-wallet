
// Shared types for dashboard functionality

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

// Type for earnings data
export type EarningsData = {
  currentBalance: number;
  initialInvestment: number;
  totalEarnings: number;
  earningsPercentage: number;
  error?: any;
};

// Mobile view control types
export type DashboardMobileView = 'summary' | 'performance' | 'investments' | 'allocation';

// View state for responsive layouts
export interface ResponsiveViewState {
  activeTab: DashboardMobileView;
  showDetails: boolean;
  condensed: boolean;
}
