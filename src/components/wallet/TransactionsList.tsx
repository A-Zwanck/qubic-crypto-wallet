
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowUpRight, ArrowDownLeft, Wallet, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'investment';
  amount: number;
  created_at: string;
  details?: string;
}

interface TransactionsListProps {
  transactions: Transaction[];
  isLoading: boolean;
  searchTerm?: string;
  setSearchTerm?: React.Dispatch<React.SetStateAction<string>>;
  filterType?: string;
  setFilterType?: React.Dispatch<React.SetStateAction<string>>;
}

const TransactionsList: React.FC<TransactionsListProps> = ({ 
  transactions, 
  isLoading, 
  searchTerm = '', 
  setSearchTerm, 
  filterType = 'all', 
  setFilterType 
}) => {
  // Local state for standalone usage (when search/filter props are not provided)
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [localFilterType, setLocalFilterType] = useState('all');
  
  // Use provided props if available, otherwise use local state
  const searchValue = searchTerm || localSearchTerm;
  const filterValue = filterType || localFilterType;
  const handleSearchChange = setSearchTerm || setLocalSearchTerm;
  const handleFilterChange = setFilterType || setLocalFilterType;
  
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Transacciones recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-qubic-blue"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="h-5 w-5 text-green-500" />;
      case 'withdraw':
        return <ArrowUpRight className="h-5 w-5 text-red-500" />;
      case 'investment':
        return <Wallet className="h-5 w-5 text-blue-500" />;
      default:
        return <ArrowDownLeft className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTransactionTitle = (type: string, details?: string) => {
    switch (type) {
      case 'deposit':
        return 'Depósito';
      case 'withdraw':
        return 'Retiro';
      case 'investment':
        return details ? `Inversión en ${details}` : 'Inversión';
      default:
        return 'Transacción';
    }
  };

  const getAmountClasses = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'text-green-600 font-medium';
      case 'withdraw':
      case 'investment':
        return 'text-red-600 font-medium';
      default:
        return 'text-gray-700 font-medium';
    }
  };

  const formatAmount = (type: string, amount: number) => {
    switch (type) {
      case 'deposit':
        return `+${amount.toFixed(2)} USDQ`;
      case 'withdraw':
      case 'investment':
        return `-${amount.toFixed(2)} USDQ`;
      default:
        return `${amount.toFixed(2)} USDQ`;
    }
  };

  // Filter transactions based on search term and type
  const filteredTransactions = transactions.filter(transaction => {
    // Filter by type
    if (filterValue !== 'all' && transaction.type !== filterValue) {
      return false;
    }
    
    // Filter by search term (check if details contain the search term)
    if (searchValue && transaction.details) {
      return transaction.details.toLowerCase().includes(searchValue.toLowerCase());
    } else if (searchValue && !transaction.details) {
      return false;
    }
    
    return true;
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Transacciones recientes</CardTitle>
        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          <div className="relative flex-grow">
            <Input
              placeholder="Buscar transacciones..."
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            {searchValue && (
              <button 
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Select 
            value={filterValue} 
            onValueChange={(value) => handleFilterChange(value)}
          >
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="deposit">Depósitos</SelectItem>
              <SelectItem value="withdraw">Retiros</SelectItem>
              <SelectItem value="investment">Inversiones</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchValue || filterValue !== 'all' 
              ? 'No se encontraron transacciones con estos criterios'
              : 'No tienes transacciones aún'}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="flex justify-between items-center p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className="bg-gray-100 rounded-full p-2 mr-3">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {getTransactionTitle(transaction.type, transaction.details)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(transaction.created_at), "d 'de' MMMM, yyyy - HH:mm", { locale: es })}
                    </div>
                  </div>
                </div>
                <div className={getAmountClasses(transaction.type)}>
                  {formatAmount(transaction.type, transaction.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionsList;
