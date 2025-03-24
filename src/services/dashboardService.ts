
// This file serves as an entry point to dashboard-related services
// Re-exporting functions from individual service files

export { fetchPerformanceData } from './performanceService';
export { calculateAssetAllocation } from './assetAllocationService';
export { getCurrentInvestments } from './investmentService';
export { getTotalEarnings } from './earningsService';

// Re-export types from dashboard types
export type { 
  PerformanceDataPoint,
  AssetAllocation,
  Investment,
  EarningsData
} from '@/types/dashboard';
