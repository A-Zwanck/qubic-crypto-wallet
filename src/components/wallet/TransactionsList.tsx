import React from 'react';
import { ArrowDown, ArrowUp, Clock, Search, Filter, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type Transaction = {
  id: string;
  type: 'deposit' | 'withdraw' | 'investment';
  amount: number;
  created_at: string;
  status: string;
  details?: string;
};

interface TransactionsListProps {
  transactions: Transaction[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterType: string;
  setFilterType: (value: string) => void;
  isLoading: boolean;
}

const TransactionsList = ({ 
  transactions, 
  searchTerm, 
  setSearchTerm, 
  filterType, 
  setFilterType,
  isLoading 
}: TransactionsListProps) => {
  // Filter transactions based on search term and filter type
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = searchTerm === '' || 
      transaction.amount.toString().includes(searchTerm) || 
      new Date(transaction.created_at).toLocaleDateString().includes(searchTerm) ||
      (transaction.details && transaction.details.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || transaction.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Get transaction icon and text based on type
  const getTransactionInfo = (type: 'deposit' | 'withdraw' | 'investment') => {
    switch (type) {
      case 'deposit':
        return {
          icon: <ArrowDown size={16} />,
          bgColor: 'bg-green-100 text-green-600',
          textColor: 'text-green-600',
          label: 'Depósito',
          prefix: '+'
        };
      case 'withdraw':
        return {
          icon: <ArrowUp size={16} />,
          bgColor: 'bg-blue-100 text-blue-600',
          textColor: 'text-blue-600',
          label: 'Retiro',
          prefix: '-'
        };
      case 'investment':
        return {
          icon: <TrendingUp size={16} />,
          bgColor: 'bg-purple-100 text-purple-600',
          textColor: 'text-purple-600',
          label: 'Inversión',
          prefix: '-'
        };
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-xl font-bold text-qubic-black mb-4 md:mb-0">Historial de movimientos</h2>
        
        <div className="flex flex-col md:flex-row w-full md:w-auto gap-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-qubic-gray-dark" />
            <Input 
              type="text"
              placeholder="Buscar transacciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full md:w-60"
            />
          </div>
          
          <div className="relative">
            <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-qubic-gray-dark" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-qubic-blue/20 focus:border-qubic-blue"
            >
              <option value="all">Todos los movimientos</option>
              <option value="deposit">Solo depósitos</option>
              <option value="withdraw">Solo retiros</option>
              <option value="investment">Solo inversiones</option>
            </select>
          </div>
        </div>
      </div>
      
      {filteredTransactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left p-3 text-qubic-gray-dark font-medium">Tipo</th>
                <th className="text-left p-3 text-qubic-gray-dark font-medium">Fecha</th>
                <th className="text-left p-3 text-qubic-gray-dark font-medium">Hora</th>
                <th className="text-right p-3 text-qubic-gray-dark font-medium">Monto</th>
                <th className="text-right p-3 text-qubic-gray-dark font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => {
                const transactionInfo = getTransactionInfo(transaction.type);
                return (
                  <tr 
                    key={transaction.id} 
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3">
                      <div className="flex items-center">
                        <div 
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center mr-3",
                            transactionInfo.bgColor
                          )}
                        >
                          {transactionInfo.icon}
                        </div>
                        <div>
                          <span className="font-medium">
                            {transactionInfo.label}
                          </span>
                          {transaction.details && (
                            <p className="text-xs text-qubic-gray-dark">{transaction.details}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-qubic-gray-dark">
                      {formatDate(transaction.created_at)}
                    </td>
                    <td className="p-3 text-qubic-gray-dark">
                      {formatTime(transaction.created_at)}
                    </td>
                    <td className={cn(
                      "p-3 text-right font-medium",
                      transactionInfo.textColor
                    )}>
                      {transactionInfo.prefix}{transaction.amount.toFixed(2)} USDQ
                    </td>
                    <td className="p-3 text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Completado
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <Clock size={40} className="mx-auto text-qubic-gray-dark mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-qubic-black mb-1">No hay transacciones</h3>
          <p className="text-qubic-gray-dark">
            No se encontraron transacciones que coincidan con tu búsqueda.
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionsList;
